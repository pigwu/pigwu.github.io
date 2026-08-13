(function () {
  var routeData = {
    campus: {
      label: "Yungu Loop",
      title: "云谷校园环线",
      copy: "低强度 4-6 km，适合新成员熟悉集合点、热身节奏和夜跑安全规则。",
      distance: "4-6 km",
      elevation: "low",
      focus: "social",
      motion: "Open"
    },
    hills: {
      label: "Liuxia Hills",
      title: "留下山路训练",
      copy: "8-12 km 起伏路线，适合练习爬坡节奏、下坡控制和队伍补给协作。",
      distance: "8-12 km",
      elevation: "+240 m",
      focus: "climb",
      motion: "Climb"
    },
    lake: {
      label: "Westlake Long Run",
      title: "西湖长距离",
      copy: "10-16 km 周末晨跑路线，按配速分组出发，重在稳定巡航和一起完成。",
      distance: "10-16 km",
      elevation: "rolling",
      focus: "endurance",
      motion: "Endurance"
    },
    track: {
      label: "Track Session",
      title: "操场节奏课",
      copy: "短间歇、阈值跑和跑姿练习，适合想提升速度感和动作效率的同学。",
      distance: "6-8 km",
      elevation: "flat",
      focus: "speed",
      motion: "Speed"
    }
  };

  var sessionData = {
    recovery: {
      day: "MON / 19:30",
      title: "恢复慢跑",
      copy: "校园 4-6 km，RPE 3/10，重点是放松、聊天和建立稳定出勤。",
      distance: "4-6 km",
      intensity: "Easy",
      meet: "体育馆",
      effort: 28
    },
    tempo: {
      day: "WED / 20:00",
      title: "间歇 / 节奏",
      copy: "热身后进入短组节奏跑，RPE 6-8/10，适合想提升配速控制的成员。",
      distance: "6-8 km",
      intensity: "Tempo",
      meet: "操场",
      effort: 72
    },
    longrun: {
      day: "SAT / 07:30",
      title: "长距离探索",
      copy: "西湖与山地路线可选，RPE 4-6/10，按配速分组并设置补给点。",
      distance: "10-16 km",
      intensity: "Steady",
      meet: "校门口",
      effort: 58
    }
  };

  var planData = {
    monday: {
      tag: "Tonight Signal",
      title: "云谷轻松跑",
      copy: "从体育馆出发，完成 5 km 校园慢跑。适合第一次加入，也适合比赛后恢复。",
      meta: "Meet 19:30 / 体育馆 / Easy"
    },
    wednesday: {
      tag: "Speed Signal",
      title: "操场节奏课",
      copy: "热身后进行节奏跑和跑姿练习，保持动作放松，结束后统一慢跑冷身。",
      meta: "Meet 20:00 / 操场看台 / Tempo"
    },
    saturday: {
      tag: "Long Run Signal",
      title: "西湖晨跑",
      copy: "按配速分组跑 10-16 km，途中设置补给和折返点，新成员可选择短线。",
      meta: "Meet 07:30 / 校门口 / Endurance"
    },
    sunday: {
      tag: "Recovery Signal",
      title: "恢复与拉伸",
      copy: "自由安排拉伸、力量和低强度活动，记录疲劳感，为下周训练留出恢复窗口。",
      meta: "Anytime / Self-check / Recovery"
    }
  };

  var labCopy = {
    easy: "适合社交慢跑和新成员适应路线，保持能完整说话的强度。",
    tempo: "适合节奏训练和配速控制，建议完整热身，训练后留出恢复时间。",
    trail: "适合山路探索和越野适应，注意补水、鞋底抓地和下坡控制。"
  };

  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (item) { item.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.16 });

    items.forEach(function (item) { observer.observe(item); });
  }

  function initHeroParallax() {
    var hero = document.querySelector(".club-hero");
    if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    hero.addEventListener("pointermove", function (event) {
      var rect = hero.getBoundingClientRect();
      var x = ((event.clientX - rect.left) / rect.width - 0.5).toFixed(3);
      var y = ((event.clientY - rect.top) / rect.height - 0.5).toFixed(3);
      hero.style.setProperty("--pointer-x", x);
      hero.style.setProperty("--pointer-y", y);
    });
  }

  function initPageSignals() {
    var progress = document.querySelector("[data-scroll-progress]");
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function updateProgress() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var value = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
      document.documentElement.style.setProperty("--scroll-progress", value.toFixed(2) + "%");
      if (progress) progress.style.width = value.toFixed(2) + "%";
    }

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    if (reduceMotion) return;
    window.addEventListener("pointermove", function (event) {
      document.documentElement.style.setProperty("--cursor-x", event.clientX + "px");
      document.documentElement.style.setProperty("--cursor-y", event.clientY + "px");
    }, { passive: true });
  }

  function setText(selector, value) {
    var item = document.querySelector(selector);
    if (item) item.textContent = value;
  }

  function pulse(element) {
    if (!element) return;
    element.classList.remove("is-updating");
    void element.offsetWidth;
    element.classList.add("is-updating");
  }

  function secondsToPace(seconds) {
    var minutes = Math.floor(seconds / 60);
    var rest = seconds % 60;
    return minutes + ":" + String(rest).padStart(2, "0");
  }

  function secondsToDuration(totalSeconds) {
    var hours = Math.floor(totalSeconds / 3600);
    var minutes = Math.floor((totalSeconds % 3600) / 60);
    var seconds = Math.round(totalSeconds % 60);
    if (hours) return hours + " h " + minutes + " min";
    return minutes + " min " + seconds + " sec";
  }

  function initRouteControls() {
    var controls = document.querySelectorAll("[data-route]");
    if (!controls.length) return;

    function selectRoute(route) {
      var data = routeData[route];
      if (!data) return;
      setText("[data-route-label]", data.label);
      setText("[data-route-title]", data.title);
      setText("[data-route-copy]", data.copy);
      setText("[data-route-name]", data.label);
      setText("[data-route-km]", data.distance);
      setText("[data-route-elevation]", data.elevation);
      setText("[data-route-focus]", data.focus);
      setText("[data-motion-index]", data.motion);
      controls.forEach(function (control) {
        control.classList.toggle("is-active", control.dataset.route === route);
      });
      pulse(document.querySelector(".route-brief"));
      pulse(document.querySelector(".route-readout"));
    }

    controls.forEach(function (control) {
      control.addEventListener("click", function () {
        selectRoute(control.dataset.route);
      });
    });
  }

  function initSessionControls() {
    var cards = document.querySelectorAll("[data-session]");
    if (!cards.length) return;

    function selectSession(session) {
      var data = sessionData[session];
      if (!data) return;
      setText("[data-session-day]", data.day);
      setText("[data-session-title]", data.title);
      setText("[data-session-copy]", data.copy);
      setText("[data-session-distance]", data.distance);
      setText("[data-session-intensity]", data.intensity);
      setText("[data-session-meet]", data.meet);
      var meter = document.querySelector("[data-effort-meter]");
      if (meter) meter.style.width = data.effort + "%";
      document.documentElement.style.setProperty("--effort", data.effort + "%");
      cards.forEach(function (card) {
        var active = card.dataset.session === session;
        card.classList.toggle("is-active", active);
        card.setAttribute("aria-pressed", active ? "true" : "false");
      });
      pulse(document.querySelector(".session-panel"));
    }

    cards.forEach(function (card) {
      card.addEventListener("click", function () {
        selectSession(card.dataset.session);
      });
      card.addEventListener("keydown", function (event) {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        selectSession(card.dataset.session);
      });
    });
  }

  function initCalendarControls() {
    var cards = document.querySelectorAll("[data-plan]");
    if (!cards.length) return;

    function selectPlan(plan) {
      var data = planData[plan];
      if (!data) return;
      setText("[data-plan-tag]", data.tag);
      setText("[data-plan-title]", data.title);
      setText("[data-plan-copy]", data.copy);
      setText("[data-plan-meta]", data.meta);
      cards.forEach(function (card) {
        var active = card.dataset.plan === plan;
        card.classList.toggle("is-active", active);
        card.setAttribute("aria-pressed", active ? "true" : "false");
      });
      pulse(document.querySelector(".calendar-detail"));
    }

    cards.forEach(function (card) {
      card.addEventListener("click", function () {
        selectPlan(card.dataset.plan);
      });
      card.addEventListener("keydown", function (event) {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        selectPlan(card.dataset.plan);
      });
    });
  }

  function initPaceLab() {
    var distanceRange = document.querySelector("[data-distance-range]");
    var paceRange = document.querySelector("[data-pace-range]");
    var modeButtons = document.querySelectorAll("[data-mode]");
    if (!distanceRange || !paceRange || !modeButtons.length) return;

    var activeMode = "easy";

    function updateLab() {
      var distance = Number(distanceRange.value);
      var pace = Number(paceRange.value);
      var modeFactor = activeMode === "tempo" ? 1.35 : activeMode === "trail" ? 1.22 : 0.82;
      var load = Math.min(100, Math.round(distance * (520 / pace) * 6.8 * modeFactor));
      var recovery = activeMode === "tempo" ? Math.max(18, Math.round(load * 0.75)) : activeMode === "trail" ? Math.max(20, Math.round(load * 0.68)) : Math.max(12, Math.round(load * 0.48));
      var group = pace <= 315 ? "Fast Group" : pace <= 390 ? "Steady Group" : "Easy Group";

      setText("[data-distance-output]", distance.toFixed(1));
      setText("[data-pace-output]", secondsToPace(pace));
      setText("[data-time-output]", secondsToDuration(distance * pace));
      setText("[data-lab-copy]", labCopy[activeMode]);
      setText("[data-load-output]", String(load));
      setText("[data-recovery-output]", recovery + "h");
      setText("[data-match-output]", group);

      var loadBar = document.querySelector("[data-load-bar]");
      var recoveryBar = document.querySelector("[data-recovery-bar]");
      var matchBar = document.querySelector("[data-match-bar]");
      if (loadBar) loadBar.style.width = load + "%";
      if (recoveryBar) recoveryBar.style.width = Math.min(100, recovery * 1.8) + "%";
      if (matchBar) matchBar.style.width = (group === "Fast Group" ? 88 : group === "Steady Group" ? 68 : 46) + "%";
    }

    distanceRange.addEventListener("input", updateLab);
    paceRange.addEventListener("input", updateLab);
    modeButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        activeMode = button.dataset.mode;
        modeButtons.forEach(function (item) {
          var active = item === button;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-pressed", active ? "true" : "false");
        });
        updateLab();
        pulse(document.querySelector(".pace-result"));
      });
    });

    updateLab();
  }

  function initTiltCards() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var cards = document.querySelectorAll(".mission-grid article, .race-card, .training-stack article, .calendar-board article, .join-grid div, .captain-card, .pace-control-panel, .pace-result, .energy-board, .calendar-detail");
    cards.forEach(function (card) {
      card.addEventListener("pointermove", function (event) {
        var rect = card.getBoundingClientRect();
        var x = (event.clientX - rect.left) / rect.width - 0.5;
        var y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = "translateY(-3px) rotateX(" + (-y * 4).toFixed(2) + "deg) rotateY(" + (x * 4).toFixed(2) + "deg)";
      });
      card.addEventListener("pointerleave", function () {
        card.style.transform = "";
      });
    });
  }

  function init() {
    initPageSignals();
    initReveal();
    initHeroParallax();
    initRouteControls();
    initSessionControls();
    initCalendarControls();
    initPaceLab();
    initTiltCards();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
