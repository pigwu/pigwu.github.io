const state = { content: null, runningEntries: [], posts: [], memoryMap: null, componentDesign: null, git: null, uploads: { blog: [], running: [] }, avatar: null };
const titles = {
  dashboard: ["CONTENT OVERVIEW", "网站内容工作台"],
  profile: ["PROFILE & ABOUT", "主页与介绍"],
  blog: ["JOURNAL EDITOR", "发布 Blog"],
  running: ["RUNNING ARCHIVE", "新增跑步记录"],
  memory: ["MEMORY MAP", "回忆地图"],
  design: ["COMPONENT LAB", "外观与组件"],
  publish: ["SHIP TO GITHUB", "发布网站"]
};
const memoryStyles = [
  ["expedition","Expedition Route","蜿蜒探险路线"],["metro","Metro Diagram","地铁线路与站点"],["passport","Passport Journal","护照手帐与印章"],
  ["constellation","Constellation Trail","星座与发光轨迹"],["editorial","Editorial Magazine","非对称杂志跨栏"],["polaroid","Polaroid Wall","拍立得照片墙"],
  ["brutalist","Brutalist Board","粗野主义信息网格"],["glass","Glass Atlas","玻璃地图与漂浮卡片"],["terminal","Terminal Log","命令行日志"],
  ["orbital","Orbital Timeline","环形轨道节点"],["notebook","Research Notebook","研究笔记横线纸"],["museum","Museum Labels","横向博物馆展览"]
];

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
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
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
  populateMemory();
  populateDesign();
}

const designDefaults = {
  avatarShape:"circle",avatarBorderStyle:"solid",avatarBorderWidth:1,avatarBorderColor:"#43d9ff",
  cardShape:"rounded",cardBorderStyle:"solid",cardBorderWidth:1,cardBorderColor:"#43d9ff",
  cardShadow:"soft",buttonShape:"pill",lineStyle:"solid",lineWidth:1,lineColor:"#43d9ff"
};

function designRadius(shape) {
  return ({sharp:"0",subtle:"8px",rounded:"22px",capsule:"44px",cut:"0"})[shape] || "22px";
}

function renderDesignPreview() {
  const design = state.componentDesign;
  const canvas = $(".design-preview__canvas");
  if (!design || !canvas) return;
  const avatar = {
    circle:["50%","none"],rounded:["24px","none"],arch:["50% 50% 8px 8px","none"],square:["0","none"],
    diamond:["0","polygon(50% 0,100% 50%,50% 100%,0 50%)"],blob:["63% 37% 58% 42%/44% 61% 39% 56%","none"]
  }[design.avatarShape] || ["50%","none"];
  const shadows = {
    none:"none",soft:"0 18px 48px -25px #000a",lifted:"0 30px 70px -22px #000d",
    hard:`9px 9px 0 ${design.cardBorderColor}`,glow:`0 0 0 1px ${design.cardBorderColor},0 0 32px ${design.cardBorderColor}88`
  };
  const cardClip = design.cardShape === "cut" ? "polygon(18px 0,100% 0,100% calc(100% - 18px),calc(100% - 18px) 100%,0 100%,0 18px)" : "none";
  Object.entries({
    "--preview-avatar-radius":avatar[0],"--preview-avatar-clip":avatar[1],"--preview-avatar-border-style":design.avatarBorderStyle,
    "--preview-avatar-border-width":`${design.avatarBorderWidth}px`,"--preview-avatar-border-color":design.avatarBorderColor,
    "--preview-card-radius":designRadius(design.cardShape),"--preview-card-clip":cardClip,"--preview-card-border-style":design.cardBorderStyle,
    "--preview-card-border-width":`${design.cardBorderWidth}px`,"--preview-card-border-color":design.cardBorderColor,
    "--preview-card-shadow":shadows[design.cardShadow] || shadows.soft,
    "--preview-button-radius":design.buttonShape === "square" ? "0" : design.buttonShape === "rounded" ? "9px" : "999px",
    "--preview-line-style":design.lineStyle,"--preview-line-width":`${design.lineWidth}px`,"--preview-line-color":design.lineColor
  }).forEach(([key,value]) => canvas.style.setProperty(key,value));
  $$("[data-design-output]").forEach(output => output.textContent = `${design[output.dataset.designOutput]}px`);
}

function populateDesign() {
  state.componentDesign = {...designDefaults,...(state.componentDesign || {})};
  fillForm($("#design-form"), state.componentDesign);
  $("#design-avatar").src = `/site-images/${encodeURIComponent(state.content.profile.avatar)}?v=${Date.now()}`;
  renderDesignPreview();
}

function memoryPreview() {
  const frame = $("#memory-preview");
  if (!frame?.contentWindow || !state.memoryMap) return;
  const memory = structuredClone(state.memoryMap);
  memory.days.forEach(day => {
    day.previewImage = day.newImages?.[0]?.dataUrl || (day.images?.[0] ? `/site-images/${String(day.images[0]).replace(/^\/images\//,"")}` : "");
  });
  frame.contentWindow.postMessage({ type:"memory-preview", memory }, location.origin);
}

function renderMemoryStyles() {
  $("#memory-style-grid").innerHTML = memoryStyles.map(([id,name,description]) => `<button type="button" class="memory-style ${state.memoryMap.style === id ? "is-active" : ""}" data-memory-style="${id}"><span class="memory-style__sketch memory-style__${id}"><i></i><i></i><i></i></span><strong>${name}</strong><small>${description}</small></button>`).join("");
  $("#memory-preview-style").textContent = memoryStyles.find(style => style[0] === state.memoryMap.style)?.[1] || "Expedition Route";
}

function renderMemoryDays() {
  const days = state.memoryMap.days;
  $("#memory-day-list").innerHTML = days.length ? days.map((day,index) => `<article class="memory-day-editor">
    <header><div><span>${String(index + 1).padStart(2,"0")}</span><strong>${escapeHtml(day.title || "New memory")}</strong></div><div><button type="button" data-memory-move="${index}:up" ${index === 0 ? "disabled" : ""}>↑ 上移</button><button type="button" data-memory-move="${index}:down" ${index === days.length - 1 ? "disabled" : ""}>↓ 下移</button><button type="button" class="danger" data-memory-delete="${index}">删除</button></div></header>
    <div class="memory-day-editor__body"><div class="field-pair"><label>标题<input data-memory-field="${index}:title" value="${escapeHtml(day.title)}"></label><label>日期<input type="date" data-memory-field="${index}:date" value="${escapeHtml(day.date)}"></label><label>地点<input data-memory-field="${index}:location" value="${escapeHtml(day.location || "")}"></label><label>标签（逗号分隔）<input data-memory-field="${index}:tags" value="${escapeHtml((day.tags || []).join(", "))}"></label></div><label>卡片摘要<textarea rows="3" data-memory-field="${index}:summary">${escapeHtml(day.summary || "")}</textarea></label><label>点击后显示的完整故事<textarea rows="8" data-memory-field="${index}:body">${escapeHtml(day.body || "")}</textarea></label>
    <label>照片（最多 12 张）</label><div class="memory-images">${(day.images || []).map((image,imageIndex) => `<div><img src="/site-images/${escapeHtml(String(image).replace(/^\/images\//,""))}" alt=""><button type="button" data-memory-image-remove="${index}:existing:${imageIndex}">×</button></div>`).join("")}${(day.newImages || []).map((image,imageIndex) => `<div><img src="${image.dataUrl}" alt=""><button type="button" data-memory-image-remove="${index}:new:${imageIndex}">×</button></div>`).join("")}</div><label class="memory-image-add">+ 选择照片<input type="file" multiple accept="image/jpeg,image/png,image/webp" data-memory-upload="${index}" hidden></label></div>
  </article>`).join("") : `<div class="memory-zero"><strong>路线目前是空的</strong><p>点击“新日期”开始。日期可以随后自由增减。</p></div>`;
  $$("[data-memory-field]").forEach(field => field.addEventListener("input", () => {
    const [index,key] = field.dataset.memoryField.split(":");
    state.memoryMap.days[index][key] = key === "tags" ? field.value.split(",").map(tag => tag.trim()).filter(Boolean) : field.value;
    memoryPreview();
  }));
}

function populateMemory() {
  state.memoryMap ||= {eyebrow:"MEMORY MAP",title:"A route through days worth remembering.",description:"",style:"expedition",accent:"#df6c3f",background:"#f5f1e8",days:[]};
  state.memoryMap.days ||= [];
  state.memoryMap.days.forEach(day => day.newImages ||= []);
  fillForm($("#memory-form"), state.memoryMap);
  renderMemoryStyles();
  renderMemoryDays();
  memoryPreview();
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
    state.memoryMap = data.memoryMap;
    state.componentDesign = data.componentDesign;
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

$("#memory-form").addEventListener("input", event => {
  if (!event.target.name || event.target.closest(".memory-day-editor")) return;
  state.memoryMap[event.target.name] = event.target.value;
  memoryPreview();
});

$("#memory-form").addEventListener("submit", async event => {
  event.preventDefault();
  const button = $("button[type=submit]", event.currentTarget);
  button.disabled = true;
  try {
    const result = await api("/api/memory/save", { method:"POST", body:{ memory:state.memoryMap } });
    state.memoryMap = result.memoryMap;
    populateMemory();
    await refreshGit();
    showNotice("回忆地图已保存到本地。确认后可以统一发布。");
  } catch (error) { showNotice(error.message, true); }
  finally { button.disabled = false; }
});

$("#design-form").addEventListener("input", event => {
  if (!event.target.name) return;
  state.componentDesign[event.target.name] = event.target.type === "range" ? Number(event.target.value) : event.target.value;
  renderDesignPreview();
});

$("#design-form").addEventListener("submit", async event => {
  event.preventDefault();
  const button = $("button[type=submit]", event.currentTarget);
  button.disabled = true;
  try {
    const result = await api("/api/design/save", {method:"POST",body:{design:state.componentDesign}});
    state.componentDesign = result.componentDesign;
    populateDesign();
    await refreshGit();
    showNotice("组件外观已保存到本地。发布后会应用到整个网站。");
  } catch (error) { showNotice(error.message,true); }
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
  const style = event.target.closest("[data-memory-style]");
  if (style) { state.memoryMap.style = style.dataset.memoryStyle; renderMemoryStyles(); memoryPreview(); }
  if (event.target.closest("#memory-add-day")) {
    state.memoryMap.days.push({id:`memory-${Date.now().toString(36)}`,date:today(),title:"New Memory",location:"",summary:"",body:"",images:[],newImages:[],tags:[]});
    renderMemoryDays(); memoryPreview();
  }
  const move = event.target.closest("[data-memory-move]");
  if (move) {
    const [fromText,direction] = move.dataset.memoryMove.split(":"), from=Number(fromText), to=direction === "up" ? from-1 : from+1, days=state.memoryMap.days;
    if (to >= 0 && to < days.length) { [days[from],days[to]]=[days[to],days[from]]; renderMemoryDays(); memoryPreview(); }
  }
  const deleteMemory = event.target.closest("[data-memory-delete]");
  if (deleteMemory && confirm("删除这个日期节点吗？已保存的照片文件会暂时保留。")) { state.memoryMap.days.splice(Number(deleteMemory.dataset.memoryDelete),1); renderMemoryDays(); memoryPreview(); }
  const removeMemoryImage = event.target.closest("[data-memory-image-remove]");
  if (removeMemoryImage) { const [dayIndex,kind,imageIndex]=removeMemoryImage.dataset.memoryImageRemove.split(":"); state.memoryMap.days[dayIndex][kind === "new" ? "newImages" : "images"].splice(Number(imageIndex),1); renderMemoryDays(); memoryPreview(); }
  if (event.target.closest("#design-reset")) {
    state.componentDesign = {...designDefaults};
    populateDesign();
  }
});

document.addEventListener("change", async event => {
  const upload = event.target.closest("[data-memory-upload]");
  if (!upload) return;
  try {
    const images = await readFiles(upload.files);
    const day = state.memoryMap.days[Number(upload.dataset.memoryUpload)];
    day.newImages = [...(day.newImages || []), ...images].slice(0, Math.max(0, 12 - (day.images || []).length));
    renderMemoryDays(); memoryPreview();
  } catch (error) { showNotice(error.message, true); }
});

window.addEventListener("message", event => {
  if (event.origin === location.origin && event.data?.type === "memory-preview-ready") memoryPreview();
});

setupDropzones();
load();
