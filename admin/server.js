const http = require("http");
const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(__dirname, "public");
const HOST = "127.0.0.1";
const PORT = Number(process.env.YUNZHI_ADMIN_PORT || 4173);
const MAX_BODY = 80 * 1024 * 1024;

const JSON_HEADERS = { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" };
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp"
};

const MANAGED_PATHS = [
  "_data/site_content.json",
  "_data/running_entries.json",
  "_data/editor_assets.json",
  "_includes/author-profile.html",
  "_pages/about.md",
  "_pages/running.md",
  "_sass/layout/_running-tech.scss",
  "_config.yml",
  "_posts",
  "admin",
  "start-admin.cmd"
];

function sendJson(res, status, value) {
  res.writeHead(status, JSON_HEADERS);
  res.end(JSON.stringify(value));
}

function safeReadJson(relativePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), "utf8"));
  } catch (_) {
    return fallback;
  }
}

function writeJson(relativePath, value) {
  const target = path.join(ROOT, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function rememberAsset(relativePath) {
  const normalized = relativePath.replace(/\\/g, "/").replace(/^\/+/, "");
  const assets = safeReadJson("_data/editor_assets.json", []);
  if (!assets.includes(normalized)) {
    assets.push(normalized);
    writeJson("_data/editor_assets.json", assets.sort());
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", chunk => {
      size += chunk.length;
      if (size > MAX_BODY) {
        reject(new Error("Upload is too large. Keep the total request below 80 MB."));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}"));
      } catch (_) {
        reject(new Error("Invalid JSON request."));
      }
    });
    req.on("error", reject);
  });
}

function cleanText(value, max = 20000) {
  return String(value || "").replace(/\0/g, "").slice(0, max).trim();
}

function slugify(value) {
  const slug = cleanText(value, 180)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
  return slug || `entry-${Date.now()}`;
}

function yamlQuote(value) {
  return `"${cleanText(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\r?\n/g, " ")}"`;
}

function decodeImage(file, destinationDir, baseName) {
  if (!file || typeof file.dataUrl !== "string") return null;
  const match = file.dataUrl.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
  if (!match) throw new Error("Only JPG, PNG, and WebP images are supported.");
  const extension = match[1] === "image/png" ? ".png" : match[1] === "image/webp" ? ".webp" : ".jpg";
  fs.mkdirSync(destinationDir, { recursive: true });
  const filename = `${baseName}${extension}`;
  fs.writeFileSync(path.join(destinationDir, filename), Buffer.from(match[2], "base64"));
  return filename;
}

function saveImages(files, relativeDir, prefix) {
  const targetDir = path.join(ROOT, relativeDir);
  return (Array.isArray(files) ? files : []).slice(0, 12).map((file, index) => {
    const filename = decodeImage(file, targetDir, `${prefix}-${String(index + 1).padStart(2, "0")}`);
    rememberAsset(`${relativeDir}/${filename}`);
    return `/${relativeDir.replace(/\\/g, "/")}/${filename}`;
  });
}

function listPosts() {
  const postsDir = path.join(ROOT, "_posts");
  if (!fs.existsSync(postsDir)) return [];
  return fs.readdirSync(postsDir)
    .filter(name => /\.md$/i.test(name))
    .sort().reverse()
    .map(name => {
      const text = fs.readFileSync(path.join(postsDir, name), "utf8");
      const title = (text.match(/^title:\s*["']?(.*?)["']?\s*$/m) || [null, name])[1];
      return { name, title };
    });
}

function runGit(args) {
  return new Promise((resolve, reject) => {
    execFile("git", args, { cwd: ROOT, windowsHide: true, maxBuffer: 4 * 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error((stderr || stdout || error.message).trim()));
        return;
      }
      resolve(stdout.trim());
    });
  });
}

async function gitState() {
  const [branch, status, lastCommit] = await Promise.all([
    runGit(["branch", "--show-current"]),
    runGit(["status", "--short"]),
    runGit(["log", "-1", "--pretty=%h %s"])
  ]);
  return { branch, status: status ? status.split(/\r?\n/) : [], lastCommit };
}

async function handleApi(req, res, url) {
  if (req.method === "GET" && url.pathname === "/api/content") {
    sendJson(res, 200, {
      content: safeReadJson("_data/site_content.json", {}),
      runningEntries: safeReadJson("_data/running_entries.json", []),
      posts: listPosts(),
      git: await gitState()
    });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/git") {
    sendJson(res, 200, await gitState());
    return;
  }

  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method not allowed." });
    return;
  }

  const body = await readBody(req);

  if (url.pathname === "/api/content/save") {
    const current = safeReadJson("_data/site_content.json", {});
    const profile = body.profile || {};
    const about = body.about || {};
    const running = body.running || {};
    const next = {
      profile: {
        avatar: cleanText(current.profile?.avatar || "avatar-yunzhi.jpg", 120),
        name: cleanText(profile.name, 100),
        bio_en: cleanText(profile.bio_en),
        bio_zh: cleanText(profile.bio_zh)
      },
      about: {
        kicker_en: cleanText(about.kicker_en, 200),
        kicker_zh: cleanText(about.kicker_zh, 200),
        intro_en: cleanText(about.intro_en),
        intro_zh: cleanText(about.intro_zh)
      },
      running: {
        pb_5k: cleanText(running.pb_5k, 20),
        pb_half: cleanText(running.pb_half, 20),
        trail_elevation: cleanText(running.trail_elevation, 20),
        latest_race: cleanText(running.latest_race, 100),
        latest_distance: cleanText(running.latest_distance, 40),
        latest_elevation: cleanText(running.latest_elevation, 40),
        latest_finish: cleanText(running.latest_finish, 40)
      }
    };

    if (!next.profile.name || !next.about.intro_en) throw new Error("Name and English introduction are required.");
    if (body.avatar) {
      const filename = decodeImage(body.avatar, path.join(ROOT, "images"), "avatar-managed");
      next.profile.avatar = filename;
      rememberAsset(`images/${filename}`);
    }
    writeJson("_data/site_content.json", next);
    sendJson(res, 200, { ok: true, content: next });
    return;
  }

  if (url.pathname === "/api/blog/create") {
    const title = cleanText(body.title, 200);
    const date = /^\d{4}-\d{2}-\d{2}$/.test(body.date || "") ? body.date : new Date().toISOString().slice(0, 10);
    if (!title || !cleanText(body.body)) throw new Error("Blog title and body are required.");
    const slug = slugify(body.slug || title);
    const imageDir = `images/blog/${date}-${slug}`;
    const images = saveImages(body.images, imageDir, slug);
    const tags = cleanText(body.tags, 400).split(",").map(item => item.trim()).filter(Boolean);
    const header = [
      "---",
      `title: ${yamlQuote(title)}`,
      `date: ${date}`,
      `permalink: /blog/${slug}/`,
      `excerpt: ${yamlQuote(body.excerpt || cleanText(body.body).slice(0, 180))}`,
      `tags: [${tags.map(tag => yamlQuote(tag)).join(", ")}]`,
      "author_profile: true",
      "---",
      ""
    ];
    const gallery = images.length
      ? images.map((src, index) => `![${title} - photo ${index + 1}](${src})`).join("\n\n") + "\n\n"
      : "";
    const postsDir = path.join(ROOT, "_posts");
    fs.mkdirSync(postsDir, { recursive: true });
    const filename = `${date}-${slug}.md`;
    const target = path.join(postsDir, filename);
    if (fs.existsSync(target)) throw new Error("A post with this date and slug already exists.");
    fs.writeFileSync(target, `${header.join("\n")}${gallery}${cleanText(body.body, 100000)}\n`, "utf8");
    sendJson(res, 200, { ok: true, filename, images });
    return;
  }

  if (url.pathname === "/api/running/create") {
    const name = cleanText(body.name, 180);
    if (!name) throw new Error("Race or training name is required.");
    const date = /^\d{4}-\d{2}-\d{2}$/.test(body.date || "") ? body.date : new Date().toISOString().slice(0, 10);
    const id = `${date}-${slugify(name)}-${Date.now().toString(36)}`;
    const imageDir = "images/races";
    const images = saveImages(body.images, imageDir, slugify(`${date}-${name}`));
    if (!images.length) throw new Error("Add at least one running photo.");
    const entries = safeReadJson("_data/running_entries.json", []);
    entries.unshift({
      id,
      name,
      name_zh: cleanText(body.name_zh, 180),
      type: cleanText(body.type, 80) || "Race Day",
      date,
      time: cleanText(body.time, 40),
      distance: cleanText(body.distance, 40),
      elevation: cleanText(body.elevation, 40),
      note_en: cleanText(body.note_en),
      note_zh: cleanText(body.note_zh),
      images
    });
    writeJson("_data/running_entries.json", entries);
    sendJson(res, 200, { ok: true, entry: entries[0] });
    return;
  }

  if (url.pathname === "/api/running/delete") {
    const id = cleanText(body.id, 220);
    const entries = safeReadJson("_data/running_entries.json", []);
    writeJson("_data/running_entries.json", entries.filter(entry => entry.id !== id));
    sendJson(res, 200, { ok: true });
    return;
  }

  if (url.pathname === "/api/publish") {
    const state = await gitState();
    if (state.branch !== "main") throw new Error(`Publishing is only enabled on main. Current branch: ${state.branch || "unknown"}.`);
    const editorAssets = safeReadJson("_data/editor_assets.json", []).filter(relativePath => {
      const absolute = path.resolve(ROOT, relativePath);
      return absolute.startsWith(path.join(ROOT, "images")) && fs.existsSync(absolute);
    });
    const publishPaths = [...MANAGED_PATHS, ...editorAssets].filter(relativePath => fs.existsSync(path.resolve(ROOT, relativePath)));
    await runGit(["add", "--", ...publishPaths]);
    const staged = await runGit(["diff", "--cached", "--name-only"]);
    if (!staged) throw new Error("There are no editor changes to publish.");
    const message = cleanText(body.message, 180) || `Update site content ${new Date().toISOString().slice(0, 10)}`;
    await runGit(["commit", "--only", "-m", message, "--", ...publishPaths]);
    const pushOutput = await runGit(["push", "origin", "main"]);
    sendJson(res, 200, { ok: true, message, pushOutput, git: await gitState() });
    return;
  }

  sendJson(res, 404, { error: "Unknown API endpoint." });
}

function serveStatic(req, res, url) {
  if (url.pathname.startsWith("/site-images/")) {
    const relativeImage = url.pathname.replace(/^\/site-images\//, "");
    const imagesDir = path.join(ROOT, "images");
    const imageTarget = path.resolve(imagesDir, relativeImage);
    if (!imageTarget.startsWith(imagesDir) || !fs.existsSync(imageTarget) || !fs.statSync(imageTarget).isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Image not found");
      return;
    }
    res.writeHead(200, { "Content-Type": MIME[path.extname(imageTarget).toLowerCase()] || "application/octet-stream", "Cache-Control": "no-store" });
    fs.createReadStream(imageTarget).pipe(res);
    return;
  }
  const requested = url.pathname === "/" ? "index.html" : url.pathname.replace(/^\/+/, "");
  const target = path.resolve(PUBLIC_DIR, requested);
  if (!target.startsWith(PUBLIC_DIR) || !fs.existsSync(target) || !fs.statSync(target).isFile()) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }
  res.writeHead(200, { "Content-Type": MIME[path.extname(target).toLowerCase()] || "application/octet-stream", "Cache-Control": "no-store" });
  fs.createReadStream(target).pipe(res);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${HOST}:${PORT}`);
  try {
    if (url.pathname.startsWith("/api/")) await handleApi(req, res, url);
    else serveStatic(req, res, url);
  } catch (error) {
    sendJson(res, 400, { error: error.message || "Request failed." });
  }
});

server.listen(PORT, HOST, () => {
  const editorUrl = `http://${HOST}:${PORT}`;
  console.log(`Yunzhi Site Studio is running at ${editorUrl}`);
  console.log("Keep this window open while editing. Press Ctrl+C to stop.");
  if (process.platform === "win32" && process.env.YUNZHI_ADMIN_NO_OPEN !== "1") {
    execFile("cmd", ["/c", "start", "", editorUrl], { windowsHide: true }, () => {});
  }
});

server.on("error", error => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use. The Site Studio may already be open.`);
    process.exit(1);
  }
  throw error;
});
