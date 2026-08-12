const escapeHtml = value => String(value ?? "").replace(/[&<>'"]/g, character => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[character]);
function draw() {
  const map = document.getElementById("map"), nodes = [...map.querySelectorAll("i")], svg = map.querySelector("svg");
  if (nodes.length < 2) { svg.querySelector("path").setAttribute("d", ""); return; }
  const bounds = map.getBoundingClientRect(), points = nodes.map(node => { const box=node.getBoundingClientRect(); return {x:box.left+box.width/2-bounds.left,y:box.top+box.height/2-bounds.top}; });
  const route = points.slice(1).reduce((path,point,index) => { const previous=points[index]; return `${path} C ${previous.x},${previous.y+45} ${point.x},${point.y-45} ${point.x},${point.y}`; },`M ${points[0].x},${points[0].y}`);
  svg.setAttribute("viewBox",`0 0 ${bounds.width} ${map.scrollHeight}`); svg.querySelector("path").setAttribute("d",route);
}
window.addEventListener("message", event => {
  if (event.origin !== location.origin || event.data?.type !== "memory-preview") return;
  const memory=event.data.memory || {days:[]};
  document.getElementById("eyebrow").textContent=memory.eyebrow || "MEMORY MAP"; document.getElementById("title").textContent=memory.title || ""; document.getElementById("description").textContent=memory.description || "";
  const map=document.getElementById("map"); map.dataset.style=memory.style || "expedition"; document.documentElement.style.setProperty("--accent",memory.accent || "#df6c3f"); document.documentElement.style.setProperty("--bg",memory.background || "#f5f1e8");
  document.getElementById("days").innerHTML=(memory.days || []).map((day,index)=>`<article style="--day:${index}"><i>${String(index+1).padStart(2,"0")}</i><div>${day.previewImage ? `<img src="${day.previewImage}" alt="">` : `<b>${String(index+1).padStart(2,"0")}</b>`}<span><time>${escapeHtml(day.date || "Choose a date")}</time><strong>${escapeHtml(day.title || "New memory")}</strong><small>${escapeHtml(day.location || "")}</small></span></div></article>`).join("") || "<p class='empty'>Add your first date to begin the route.</p>";
  requestAnimationFrame(draw);
});
window.parent.postMessage({type:"memory-preview-ready"},location.origin);
window.addEventListener("resize",draw);
