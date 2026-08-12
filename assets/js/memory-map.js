(() => {
  const dataElement = document.getElementById("memory-map-data");
  const map = document.getElementById("memory-map");
  const daysElement = document.getElementById("memory-days");
  const dialog = document.getElementById("memory-dialog");
  if (!dataElement || !map || !daysElement || !dialog) return;

  const data = JSON.parse(dataElement.textContent || "{}");
  const days = Array.isArray(data.days) ? data.days : [];
  const escapeHtml = value => String(value ?? "").replace(/[&<>'"]/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  })[character]);

  function formatDate(value) {
    if (!value) return "DATE TO BE CHOSEN";
    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime())
      ? value
      : new Intl.DateTimeFormat("en", { month: "short", day: "2-digit", year: "numeric" }).format(date);
  }

  function render() {
    map.dataset.memoryStyle = data.style || "expedition";
    document.getElementById("memory-empty").hidden = days.length > 0;
    map.hidden = days.length === 0;
    daysElement.innerHTML = days.map((day, index) => {
      const cover = Array.isArray(day.images) ? day.images[0] : "";
      return `<button class="memory-day" data-memory-day="${index}" style="--day:${index}" aria-label="Open ${escapeHtml(day.title)}">
        <span class="memory-node"><i></i><b>${String(index + 1).padStart(2, "0")}</b></span>
        <span class="memory-card">
          ${cover ? `<img src="${escapeHtml(cover)}" alt="">` : `<span class="memory-placeholder">${String(index + 1).padStart(2, "0")}</span>`}
          <span class="memory-copy"><time>${escapeHtml(formatDate(day.date))}</time><strong>${escapeHtml(day.title)}</strong><small>${escapeHtml(day.location || "")}</small><span>${escapeHtml(day.summary || "")}</span></span>
        </span>
      </button>`;
    }).join("");
    requestAnimationFrame(drawRoute);
  }

  function drawRoute() {
    const svg = map.querySelector(".memory-route");
    const nodes = [...map.querySelectorAll(".memory-node")];
    if (nodes.length < 2) {
      svg.querySelector("path").setAttribute("d", "");
      return;
    }
    const bounds = map.getBoundingClientRect();
    const points = nodes.map(node => {
      const box = node.getBoundingClientRect();
      return { x: box.left + box.width / 2 - bounds.left, y: box.top + box.height / 2 - bounds.top };
    });
    const route = points.slice(1).reduce((path, point, index) => {
      const previous = points[index];
      const bend = Math.max(28, Math.abs(point.y - previous.y) * 0.35);
      return `${path} C ${previous.x},${previous.y + bend} ${point.x},${point.y - bend} ${point.x},${point.y}`;
    }, `M ${points[0].x},${points[0].y}`);
    svg.setAttribute("viewBox", `0 0 ${Math.max(1, bounds.width)} ${Math.max(1, map.scrollHeight)}`);
    svg.querySelector("path").setAttribute("d", route);
  }

  function openMemory(index) {
    const day = days[index];
    if (!day) return;
    const images = Array.isArray(day.images) ? day.images : [];
    const tags = Array.isArray(day.tags) ? day.tags : [];
    document.getElementById("memory-detail").innerHTML = `<header><p>${escapeHtml(formatDate(day.date))}${day.location ? ` / ${escapeHtml(day.location)}` : ""}</p><span>${String(index + 1).padStart(2, "0")}</span><h2>${escapeHtml(day.title)}</h2><div class="memory-detail__tags">${tags.map(tag => `<i>${escapeHtml(tag)}</i>`).join("")}</div></header><div class="memory-detail__gallery">${images.map(image => `<img src="${escapeHtml(image)}" alt="${escapeHtml(day.title)}">`).join("")}</div><div class="memory-detail__body">${escapeHtml(day.body || day.summary || "").split(/\n\n+/).map(paragraph => `<p>${paragraph.replace(/\n/g, "<br>")}</p>`).join("")}</div>`;
    dialog.showModal();
  }

  daysElement.addEventListener("click", event => {
    const day = event.target.closest("[data-memory-day]");
    if (day) openMemory(Number(day.dataset.memoryDay));
  });
  dialog.querySelector(".memory-dialog__close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", event => {
    if (event.target === dialog) dialog.close();
  });
  window.addEventListener("resize", () => {
    clearTimeout(drawRoute.timer);
    drawRoute.timer = setTimeout(drawRoute, 80);
  });

  render();
})();
