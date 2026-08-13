(() => {
  const dataElement = document.getElementById("memory-map-data");
  const map = document.getElementById("memory-map");
  const daysElement = document.getElementById("memory-days");
  const dialog = document.getElementById("memory-dialog");
  if (!dataElement || !map || !daysElement || !dialog) return;

  const data = JSON.parse(dataElement.textContent || "{}");
  const allDays = Array.isArray(data.days) ? data.days : [];
  const currentYear = new Date().getFullYear();
  const monthNames = {
    en: ["All", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    zh: ["全年", "1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
  };
  const text = (item, key, lang) => item?.[`${key}_${lang}`] || item?.[`${key}_en`] || item?.[key] || "";
  const escapeHtml = value => String(value ?? "").replace(/[&<>'"]/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  })[character]);
  const dateParts = value => {
    const match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
    return match ? { year:Number(match[1]), month:Number(match[2]), day:Number(match[3]) } : null;
  };

  function normalizeYears() {
    const configured = Array.isArray(data.years) ? data.years : [];
    const years = new Map(configured.map(item => [Number(item.year), {
      year:Number(item.year), title_en:item.title_en || `${item.year} in memories`, title_zh:item.title_zh || `${item.year} 年回忆`,
      style:item.style || data.style || "expedition", accent:item.accent || data.accent || "#df6c3f",
      background:{mode:"solid",color:data.background || "#f5f1e8",from:"#f5f1e8",to:"#dce9e6",angle:135,image:"",...(item.background || {})}
    }]));
    allDays.forEach(day => {
      const year = dateParts(day.date)?.year;
      if (year && !years.has(year)) years.set(year, {year,title_en:`${year} in memories`,title_zh:`${year} 年回忆`,style:data.style || "expedition",accent:data.accent || "#df6c3f",background:{mode:"solid",color:data.background || "#f5f1e8",from:"#f5f1e8",to:"#dce9e6",angle:135,image:""}});
    });
    if (!years.size) years.set(currentYear, {year:currentYear,title_en:`${currentYear} in memories`,title_zh:`${currentYear} 年回忆`,style:data.style || "expedition",accent:data.accent || "#df6c3f",background:{mode:"solid",color:data.background || "#f5f1e8",from:"#f5f1e8",to:"#dce9e6",angle:135,image:""}});
    return [...years.values()].sort((a,b) => b.year - a.year);
  }

  const years = normalizeYears();
  let activeYear = years.some(item => item.year === currentYear) ? currentYear : years[0].year;
  let activeMonth = 0;
  let visibleDays = [];
  const language = () => document.documentElement.lang === "zh" ? "zh" : "en";

  function backgroundValue(background) {
    if (background.mode === "gradient") return `linear-gradient(${Number(background.angle || 135)}deg,${background.from || "#f5f1e8"},${background.to || "#dce9e6"})`;
    if (background.mode === "image" && background.image) return `linear-gradient(#06101833,#06101833),url("${background.image}") center/cover no-repeat`;
    return background.color || "#f5f1e8";
  }

  function formatDate(value) {
    if (!value) return language() === "zh" ? "日期待定" : "DATE TO BE CHOSEN";
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat(language() === "zh" ? "zh-CN" : "en", { month:"short", day:"2-digit", year:"numeric" }).format(date);
  }

  function renderTimeNavigation() {
    const lang = language();
    document.getElementById("memory-year-tabs").innerHTML = years.map(year => `<button type="button" class="${year.year === activeYear ? "is-active" : ""}" data-memory-year="${year.year}">${year.year}</button>`).join("");
    const availableMonths = new Set(allDays.filter(day => dateParts(day.date)?.year === activeYear).map(day => dateParts(day.date)?.month));
    document.getElementById("memory-month-tabs").innerHTML = monthNames[lang].map((name,index) => `<button type="button" class="${index === activeMonth ? "is-active" : ""}" data-memory-month="${index}" ${index > 0 && !availableMonths.has(index) ? "disabled" : ""}>${name}</button>`).join("");
    const index = years.findIndex(year => year.year === activeYear);
    document.getElementById("memory-year-prev").disabled = index === years.length - 1;
    document.getElementById("memory-year-next").disabled = index === 0;
    document.getElementById("memory-year-prev").setAttribute("aria-label", lang === "zh" ? "上一年" : "Previous year");
    document.getElementById("memory-year-next").setAttribute("aria-label", lang === "zh" ? "下一年" : "Next year");
  }

  function render() {
    const lang = language();
    const year = years.find(item => item.year === activeYear) || years[0];
    const yearDays = allDays.filter(day => dateParts(day.date)?.year === activeYear);
    visibleDays = activeMonth ? yearDays.filter(day => dateParts(day.date)?.month === activeMonth) : yearDays;
    map.dataset.memoryStyle = year.style;
    map.style.setProperty("--accent", year.accent);
    map.style.setProperty("--bg", year.background.color || "#f5f1e8");
    map.style.background = backgroundValue(year.background);
    document.getElementById("memory-year-number").textContent = String(year.year);
    document.getElementById("memory-year-title").textContent = text(year,"title",lang);
    renderTimeNavigation();
    const empty = document.getElementById("memory-empty");
    empty.hidden = visibleDays.length > 0;
    map.hidden = visibleDays.length === 0;
    daysElement.innerHTML = visibleDays.map((day,index) => {
      const cover = Array.isArray(day.images) ? day.images[0] : "";
      const title = text(day,"title",lang);
      return `<button class="memory-day" data-memory-day="${index}" style="--day:${index}" aria-label="${escapeHtml(lang === "zh" ? `打开 ${title}` : `Open ${title}`)}">
        <span class="memory-node"><i></i><b>${String(index + 1).padStart(2,"0")}</b></span>
        <span class="memory-card">${cover ? `<img src="${escapeHtml(cover)}" alt="">` : `<span class="memory-placeholder">${String(index + 1).padStart(2,"0")}</span>`}<span class="memory-copy"><time>${escapeHtml(formatDate(day.date))}</time><strong>${escapeHtml(title)}</strong><small>${escapeHtml(text(day,"location",lang))}</small><span>${escapeHtml(text(day,"summary",lang))}</span></span></span>
      </button>`;
    }).join("");
    requestAnimationFrame(drawRoute);
  }

  function drawRoute() {
    const svg = map.querySelector(".memory-route");
    const nodes = [...map.querySelectorAll(".memory-node")];
    if (nodes.length < 2) { svg.querySelector("path").setAttribute("d", ""); return; }
    const bounds = map.getBoundingClientRect();
    const points = nodes.map(node => { const box=node.getBoundingClientRect(); return {x:box.left+box.width/2-bounds.left,y:box.top+box.height/2-bounds.top}; });
    const route = points.slice(1).reduce((path,point,index) => { const previous=points[index],bend=Math.max(28,Math.abs(point.y-previous.y)*.35); return `${path} C ${previous.x},${previous.y+bend} ${point.x},${point.y-bend} ${point.x},${point.y}`; },`M ${points[0].x},${points[0].y}`);
    svg.setAttribute("viewBox",`0 0 ${Math.max(1,bounds.width)} ${Math.max(1,map.scrollHeight)}`);
    svg.querySelector("path").setAttribute("d",route);
  }

  function openMemory(index) {
    const day = visibleDays[index];
    if (!day) return;
    const lang = language(), title=text(day,"title",lang), location=text(day,"location",lang);
    const images = Array.isArray(day.images) ? day.images : [], tags=Array.isArray(day.tags) ? day.tags : [];
    document.getElementById("memory-detail").innerHTML = `<header><p>${escapeHtml(formatDate(day.date))}${location ? ` / ${escapeHtml(location)}` : ""}</p><span>${String(index+1).padStart(2,"0")}</span><h2>${escapeHtml(title)}</h2><div class="memory-detail__tags">${tags.map(tag=>`<i>${escapeHtml(tag)}</i>`).join("")}</div></header><div class="memory-detail__gallery">${images.map(image=>`<img src="${escapeHtml(image)}" alt="${escapeHtml(title)}">`).join("")}</div><div class="memory-detail__body">${escapeHtml(text(day,"body",lang) || text(day,"summary",lang)).split(/\n\n+/).map(paragraph=>`<p>${paragraph.replace(/\n/g,"<br>")}</p>`).join("")}</div>`;
    dialog.showModal();
  }

  document.querySelector(".memory-time-nav").addEventListener("click", event => {
    const yearButton=event.target.closest("[data-memory-year]"),monthButton=event.target.closest("[data-memory-month]");
    if (yearButton) { activeYear=Number(yearButton.dataset.memoryYear); activeMonth=0; render(); }
    if (monthButton) { activeMonth=Number(monthButton.dataset.memoryMonth); render(); }
    const index=years.findIndex(year=>year.year===activeYear);
    if (event.target.closest("#memory-year-prev") && index < years.length-1) { activeYear=years[index+1].year; activeMonth=0; render(); }
    if (event.target.closest("#memory-year-next") && index > 0) { activeYear=years[index-1].year; activeMonth=0; render(); }
  });
  daysElement.addEventListener("click", event => { const day=event.target.closest("[data-memory-day]"); if(day) openMemory(Number(day.dataset.memoryDay)); });
  dialog.querySelector(".memory-dialog__close").addEventListener("click",()=>dialog.close());
  dialog.addEventListener("click",event=>{if(event.target===dialog)dialog.close();});
  window.addEventListener("site-language-change",render);
  window.addEventListener("resize",()=>{clearTimeout(drawRoute.timer);drawRoute.timer=setTimeout(drawRoute,80);});
  render();
})();
