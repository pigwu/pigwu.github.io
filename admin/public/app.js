const state = { content: null, runningEntries: [], posts: [], git: null, uploads: { blog: [], running: [] }, avatar: null };
const titles = {
  dashboard: ["CONTENT OVERVIEW", "网站内容工作台"],
  profile: ["PROFILE & ABOUT", "主页与介绍"],
  blog: ["JOURNAL EDITOR", "发布 Blog"],
  running: ["RUNNING ARCHIVE", "新增跑步记录"],
  publish: ["SHIP TO GITHUB", "发布网站"]
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function showNotice(message, isError = false) {
  const box = $("#notice");
  box.textContent = message;
  box.classList.toggle("is-error", isError);
  box.hidden = false;
  clearTimeout(showNotice.timer);
  showNotice.timer = setTimeout(() => { box.hidden = true; }, isError ? 8000 : 4500);
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: options.body ? { "Content-Type": "application/json" } : undefined,
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "操作失败");
  return result;
}

function switchView(name) {
  $$(".nav-item").forEach(button => button.classList.toggle("is-active", button.dataset.view === name));
  $$(".view").forEach(view => view.classList.toggle("is-active", view.id === `view-${name}`));
  $("#eyebrow").textContent = titles[name][0];
  $("#view-title").textContent = titles[name][1];
  if (name === "publish") refreshGit();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function fillForm(form, values) {
  Object.entries(values).forEach(([name, value]) => {
    const field = form.elements.namedItem(name);
    if (field) field.value = value ?? "";
  });
}

function formValues(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function updateGit(git) {
  state.git = git;
  $("#dash-branch").textContent = git.branch || "unknown";
  $("#dash-changes").textContent = `${git.status.length} files`;
  $("#dash-commit").textContent = git.lastCommit || "—";
  $("#publish-branch").textContent = git.branch || "unknown";
  $("#publish-commit").textContent = git.lastCommit || "—";
  const files = $("#git-files");
  files.innerHTML = git.status.length
    ? git.status.map(line => `<div class="git-file"><span>${escapeHtml(line.slice(0, 2).trim() || "M")}</span><div>${escapeHtml(line.slice(3))}</div></div>`).join("")
    : "<p style='padding:1rem'>没有待发布的改动。</p>";
}

async function refreshGit() {
  try { updateGit(await api("/api/git")); }
  catch (error) { showNotice(error.message, true); }
}

function escapeHtml(value) {
  return String(value || "").replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
}

function renderLists() {
  $("#post-list").innerHTML = state.posts.length
    ? state.posts.map(post => `<div class="mini-item"><strong>${escapeHtml(post.title)}</strong><small>${escapeHtml(post.name)}</small></div>`).join("")
    : "<p>还没有 Blog。</p>";
  $("#running-list").innerHTML = state.runningEntries.length
    ? state.runningEntries.map(entry => `<div class="mini-item"><strong>${escapeHtml(entry.name)}</strong><small>${escapeHtml(entry.date)} · ${escapeHtml(entry.distance || entry.type)}</small><button type="button" data-delete-run="${escapeHtml(entry.id)}">删除这条记录</button></div>`).join("")
    : "<p>还没有通过后台新增记录。</p>";
}

function populateContent() {
  const form = $("#profile-form");
  fillForm(form, { ...state.content.profile, ...state.content.about, ...state.content.running });
  $("#avatar-preview").src = `/site-images/${encodeURIComponent(state.content.profile.avatar)}?v=${Date.now()}`;
  renderLists();
}

function optimizeImage(file) {
  return new Promise((resolve, reject) => {
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) { reject(new Error(`不支持的图片格式：${file.name}`)); return; }
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const max = 2200;
      const scale = Math.min(1, max / Math.max(image.naturalWidth, image.naturalHeight));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(objectUrl);
      resolve({ name: file.name.replace(/\.[^.]+$/, ".webp"), dataUrl: canvas.toDataURL("image/webp", 0.88) });
    };
    image.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error(`无法读取 ${file.name}`)); };
    image.src = objectUrl;
  });
}

function readFiles(files) {
  return Promise.all(Array.from(files).slice(0, 12).map(optimizeImage));
}

function renderUploads(kind) {
  const preview = $(`[data-preview="${kind}"]`);
  preview.innerHTML = state.uploads[kind].map((file, index) => `<div class="preview-item"><img src="${file.dataUrl}" alt="${escapeHtml(file.name)}"><button type="button" data-remove-upload="${kind}:${index}" aria-label="移除">×</button></div>`).join("");
}

async function addUploads(kind, files) {
  try {
    const read = await readFiles(files);
    state.uploads[kind] = [...state.uploads[kind], ...read].slice(0, 12);
    renderUploads(kind);
  } catch (error) { showNotice(error.message, true); }
}

function setupDropzones() {
  $$(".dropzone").forEach(zone => {
    const kind = zone.dataset.upload;
    const input = $("input", zone);
    input.addEventListener("change", () => addUploads(kind, input.files));
    ["dragenter", "dragover"].forEach(event => zone.addEventListener(event, e => { e.preventDefault(); zone.classList.add("is-dragging"); }));
    ["dragleave", "drop"].forEach(event => zone.addEventListener(event, e => { e.preventDefault(); zone.classList.remove("is-dragging"); }));
    zone.addEventListener("drop", event => addUploads(kind, event.dataTransfer.files));
  });
}

async function load() {
  try {
    const data = await api("/api/content");
    state.content = data.content;
    state.runningEntries = data.runningEntries;
    state.posts = data.posts;
    updateGit(data.git);
    populateContent();
    $$("input[type=date]").forEach(input => { if (!input.value) input.value = today(); });
  } catch (error) { showNotice(`无法读取网站内容：${error.message}`, true); }
}

$("#profile-form").addEventListener("submit", async event => {
  event.preventDefault();
  const button = $("button[type=submit]", event.currentTarget);
  button.disabled = true;
  const values = formValues(event.currentTarget);
  try {
    const result = await api("/api/content/save", { method: "POST", body: {
      profile: { name: values.name, bio_en: values.bio_en, bio_zh: values.bio_zh },
      about: { kicker_en: values.kicker_en, kicker_zh: values.kicker_zh, intro_en: values.intro_en, intro_zh: values.intro_zh },
      running: { pb_5k: values.pb_5k, pb_half: values.pb_half, trail_elevation: values.trail_elevation, latest_race: values.latest_race, latest_distance: values.latest_distance, latest_elevation: values.latest_elevation, latest_finish: values.latest_finish },
      avatar: state.avatar
    }});
    state.content = result.content;
    state.avatar = null;
    showNotice("主页内容已保存到本地。确认后可以去“发布网站”。");
    await refreshGit();
  } catch (error) { showNotice(error.message, true); }
  finally { button.disabled = false; }
});

$("#avatar-input").addEventListener("change", async event => {
  try {
    const files = await readFiles(event.target.files);
    state.avatar = files[0] || null;
    if (state.avatar) $("#avatar-preview").src = state.avatar.dataUrl;
  } catch (error) { showNotice(error.message, true); }
});

$("#blog-form").addEventListener("submit", async event => {
  event.preventDefault();
  const button = $("button[type=submit]", event.currentTarget);
  button.disabled = true;
  try {
    const values = formValues(event.currentTarget);
    const result = await api("/api/blog/create", { method: "POST", body: { ...values, images: state.uploads.blog } });
    state.posts.unshift({ name: result.filename, title: values.title });
    state.uploads.blog = [];
    event.currentTarget.reset();
    event.currentTarget.elements.date.value = today();
    renderUploads("blog"); renderLists(); await refreshGit();
    showNotice("Blog 已创建到本地。可以继续编辑其他内容，最后统一发布。");
  } catch (error) { showNotice(error.message, true); }
  finally { button.disabled = false; }
});

$("#running-form").addEventListener("submit", async event => {
  event.preventDefault();
  const button = $("button[type=submit]", event.currentTarget);
  button.disabled = true;
  try {
    const values = formValues(event.currentTarget);
    const result = await api("/api/running/create", { method: "POST", body: { ...values, images: state.uploads.running } });
    state.runningEntries.unshift(result.entry);
    state.uploads.running = [];
    event.currentTarget.reset(); event.currentTarget.elements.date.value = today();
    renderUploads("running"); renderLists(); await refreshGit();
    showNotice("跑步记录已保存到本地。确认后可以统一发布。");
  } catch (error) { showNotice(error.message, true); }
  finally { button.disabled = false; }
});

$("#publish-button").addEventListener("click", async event => {
  const button = event.currentTarget;
  if (!state.git?.status.length) { showNotice("当前没有待发布的改动。", true); return; }
  if (!confirm("确认把内容 Commit 并 Push 到 GitHub main 分支吗？")) return;
  button.disabled = true; button.textContent = "正在发布…";
  try {
    const result = await api("/api/publish", { method: "POST", body: { message: $("#commit-message").value } });
    updateGit(result.git);
    showNotice("发布成功。GitHub Actions 正在部署网站。");
  } catch (error) { showNotice(`发布失败：${error.message}`, true); }
  finally { button.disabled = false; button.textContent = "Commit 并 Push 到 main"; }
});

document.addEventListener("click", async event => {
  const nav = event.target.closest("[data-view]"); if (nav) switchView(nav.dataset.view);
  const jump = event.target.closest("[data-jump]"); if (jump) switchView(jump.dataset.jump);
  const remove = event.target.closest("[data-remove-upload]");
  if (remove) { const [kind, index] = remove.dataset.removeUpload.split(":"); state.uploads[kind].splice(Number(index), 1); renderUploads(kind); }
  const deleteRun = event.target.closest("[data-delete-run]");
  if (deleteRun && confirm("删除这条后台跑步记录吗？照片文件暂时保留。")) {
    try { await api("/api/running/delete", { method: "POST", body: { id: deleteRun.dataset.deleteRun } }); state.runningEntries = state.runningEntries.filter(entry => entry.id !== deleteRun.dataset.deleteRun); renderLists(); await refreshGit(); showNotice("记录已从本地删除。"); }
    catch (error) { showNotice(error.message, true); }
  }
});

setupDropzones();
load();
