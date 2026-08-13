(function () {
  function parseTimeToSeconds(value) {
    if (!value || !value.includes(":")) return null;
    var parts = value.split(":").map(Number);
    if (parts.some(function (part) { return Number.isNaN(part); })) return null;
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    return null;
  }

  function formatSeconds(value, format) {
    if (format === "hh:mm:ss") {
      var h = Math.floor(value / 3600);
      var m = Math.floor((value % 3600) / 60);
      var s = value % 60;
      return h + ":" + String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
    }
    var mm = Math.floor(value / 60);
    var ss = value % 60;
    return String(mm).padStart(2, "0") + ":" + String(ss).padStart(2, "0");
  }

  function initCounters() {
    var hasAnimated = false;
    var pbGrid = document.querySelector(".running-page .pb-grid");
    if (!pbGrid) return;

    function animatePB() {
      if (hasAnimated) return;
      hasAnimated = true;

      document.querySelectorAll(".running-page .pb-value").forEach(function (el) {
        var target = el.dataset.target;
        var totalSeconds = parseTimeToSeconds(target);
        if (!totalSeconds) return;

        var format = target.split(":").length === 3 ? "hh:mm:ss" : "mm:ss";
        var start = null;
        var duration = 1800;

        function step(timestamp) {
          if (!start) start = timestamp;
          var progress = Math.min((timestamp - start) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = formatSeconds(Math.round(totalSeconds * eased), format);
          if (progress < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
      });
    }

    if (!("IntersectionObserver" in window)) {
      animatePB();
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animatePB();
          observer.disconnect();
        }
      });
    }, { threshold: 0.35 });

    observer.observe(pbGrid);
  }

  function initReveal() {
    var items = document.querySelectorAll(".running-page .reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (item) { item.classList.add("is-visible"); });
      return;
    }

    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16 });

    items.forEach(function (item) { revealObserver.observe(item); });
  }

  function currentLanguage() {
    return document.documentElement.getAttribute("lang") === "zh" ? "zh" : "en";
  }

  function localizedValue(value, lang) {
    if (!value) return "";
    if (typeof value === "string") return value;
    return value[lang] || value.en || value.zh || "";
  }

  function setLocalizedElement(element, value) {
    if (!element) return;
    var enText = localizedValue(value, "en");
    var zhText = localizedValue(value, "zh") || enText;
    element.setAttribute("data-en", enText);
    element.setAttribute("data-zh", zhText);
    element.textContent = currentLanguage() === "zh" ? zhText : enText;
  }

  function replaceChildren(element) {
    if (!element) return;
    if (typeof element.replaceChildren === "function") element.replaceChildren();
    else element.innerHTML = "";
  }

  function createCarousel(carousel) {
    if (!carousel) return null;
    if (carousel._raceCarousel) return carousel._raceCarousel;

    var imagesWrap = carousel.querySelector(".race-images");
    var prevBtn = carousel.querySelector(".carousel-btn.prev");
    var nextBtn = carousel.querySelector(".carousel-btn.next");
    var dotsWrap = carousel.querySelector(".carousel-dots");
    var thumbsWrap = carousel.querySelector(".carousel-thumbs");
    var status = carousel.querySelector(".carousel-status");
    var caption = carousel.querySelector(".carousel-caption");
    var images = [];
    var currentIndex = 0;
    var timer = null;
    var paused = false;
    var startX = 0;
    var startY = 0;
    var autoplay = carousel.dataset.autoplay === "true";
    var interval = Number(carousel.dataset.interval || 5000);
    var dots = [];
    var thumbs = [];

    function syncImages() {
      images = Array.prototype.slice.call(carousel.querySelectorAll(".race-images img"));
      var activeIndex = images.findIndex(function (img) { return img.classList.contains("active"); });
      currentIndex = Math.max(0, activeIndex);
    }

    function captionFor(index, lang) {
      if (!images[index]) return "";
      if (lang === "zh") {
        return images[index].dataset.captionZh || images[index].dataset.caption || images[index].alt || "";
      }
      return images[index].dataset.caption || images[index].alt || "";
    }

    function setCaption(index) {
      if (!caption) return;
      setLocalizedElement(caption, {
        en: captionFor(index, "en"),
        zh: captionFor(index, "zh")
      });
    }

    function refreshCaption() {
      setCaption(currentIndex);
    }

    function setActive(index) {
      if (!images.length) return;
      currentIndex = (index + images.length) % images.length;

      images.forEach(function (img, i) {
        var isActive = i === currentIndex;
        img.classList.toggle("active", isActive);
        img.setAttribute("aria-hidden", String(!isActive));
      });

      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === currentIndex);
        dot.setAttribute("aria-current", i === currentIndex ? "true" : "false");
      });

      thumbs.forEach(function (thumb, i) {
        thumb.classList.toggle("is-active", i === currentIndex);
        thumb.setAttribute("aria-current", i === currentIndex ? "true" : "false");
      });

      if (status) status.textContent = (currentIndex + 1) + " / " + images.length;
      setCaption(currentIndex);
    }

    function stopTimer() {
      if (timer) window.clearInterval(timer);
      timer = null;
    }

    function startTimer() {
      stopTimer();
      if (!autoplay || paused || images.length <= 1) return;
      timer = window.setInterval(function () {
        setActive(currentIndex + 1);
      }, interval);
    }

    function pause() {
      paused = true;
      stopTimer();
    }

    function resume() {
      paused = false;
      startTimer();
    }

    function hideControls(hidden) {
      [prevBtn, nextBtn, dotsWrap, thumbsWrap, status].forEach(function (el) {
        if (el) el.hidden = hidden;
      });
    }

    function buildControls() {
      dots = [];
      thumbs = [];
      replaceChildren(dotsWrap);
      replaceChildren(thumbsWrap);

      if (images.length <= 1) {
        hideControls(true);
        setActive(0);
        return;
      }

      hideControls(false);

      if (dotsWrap) {
        images.forEach(function (_, i) {
          var dot = document.createElement("button");
          dot.type = "button";
          dot.setAttribute("aria-label", "Show image " + (i + 1));
          dot.addEventListener("click", function () {
            pause();
            setActive(i);
          });
          dotsWrap.appendChild(dot);
          dots.push(dot);
        });
      }

      if (thumbsWrap) {
        images.forEach(function (image, i) {
          var button = document.createElement("button");
          var thumb = document.createElement("img");
          button.type = "button";
          button.setAttribute("aria-label", "Show " + captionFor(i, "en"));
          thumb.src = image.currentSrc || image.src;
          thumb.alt = "";
          thumb.className = image.className.replace("active", "").trim();
          if (image.dataset.fit) thumb.dataset.fit = image.dataset.fit;
          button.appendChild(thumb);
          button.addEventListener("click", function () {
            pause();
            setActive(i);
          });
          thumbsWrap.appendChild(button);
          thumbs.push(button);
        });
      }
    }

    function setSlides(slides, ariaLabel) {
      stopTimer();
      paused = false;
      if (ariaLabel) carousel.setAttribute("aria-label", ariaLabel);
      replaceChildren(imagesWrap);

      (slides || []).forEach(function (slide, i) {
        var image = document.createElement("img");
        image.src = slide.src;
        image.alt = slide.alt || "";
        image.className = (slide.className || "") + (i === 0 ? " active" : "");
        image.className = image.className.trim();
        if (slide.fit) image.dataset.fit = slide.fit;
        if (slide.caption) {
          image.dataset.caption = localizedValue(slide.caption, "en");
          image.dataset.captionZh = localizedValue(slide.caption, "zh");
        }
        image.setAttribute("aria-hidden", i === 0 ? "false" : "true");
        imagesWrap.appendChild(image);
      });

      syncImages();
      currentIndex = 0;
      buildControls();
      setActive(0);
      startTimer();
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        pause();
        setActive(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        pause();
        setActive(currentIndex + 1);
      });
    }

    carousel.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        pause();
        setActive(currentIndex - 1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        pause();
        setActive(currentIndex + 1);
      }
    });

    carousel.addEventListener("mouseenter", pause);
    carousel.addEventListener("mouseleave", resume);
    carousel.addEventListener("focusin", pause);
    carousel.addEventListener("focusout", resume);

    carousel.addEventListener("touchstart", function (event) {
      if (!event.touches.length) return;
      pause();
      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
    }, { passive: true });

    carousel.addEventListener("touchend", function (event) {
      if (!event.changedTouches.length) return;
      var dx = event.changedTouches[0].clientX - startX;
      var dy = event.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy)) {
        setActive(dx < 0 ? currentIndex + 1 : currentIndex - 1);
      }
    }, { passive: true });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stopTimer();
      else startTimer();
    });

    var langToggle = document.getElementById("lang-toggle");
    if (langToggle) {
      langToggle.addEventListener("click", function () {
        window.setTimeout(refreshCaption, 0);
      });
    }

    syncImages();
    buildControls();
    setActive(currentIndex);
    startTimer();

    carousel._raceCarousel = {
      refreshCaption: refreshCaption,
      setActive: setActive,
      setSlides: setSlides,
      pause: pause,
      resume: resume
    };

    return carousel._raceCarousel;
  }

  function initCarousels() {
    document.querySelectorAll(".race-image-carousel").forEach(function (carousel) {
      createCarousel(carousel);
    });
  }

  function parseRaceTimestamp(value) {
    if (!value) return 0;
    var match = String(value).match(/(\d{4})[.\/-](\d{1,2})[.\/-](\d{1,2})(?:\s+(\d{1,2}):(\d{2}))?/);
    if (!match) return 0;
    return new Date(
      Number(match[1]),
      Number(match[2]) - 1,
      Number(match[3]),
      Number(match[4] || 0),
      Number(match[5] || 0)
    ).getTime();
  }

  function initRaceShowcase() {
    var root = document.querySelector("[data-race-showcase]");
    if (!root) return;

    var featured = root.querySelector("[data-race-featured]");
    if (!featured) return;

    var title = featured.querySelector("[data-race-title]");
    var carousel = featured.querySelector("[data-race-carousel]");
    var type = featured.querySelector("[data-race-type]");
    var date = featured.querySelector("[data-race-date]");
    var name = featured.querySelector("[data-race-name]");
    var note = featured.querySelector("[data-race-note]");
    var metrics = featured.querySelector("[data-race-metrics]");
    var carouselApi = createCarousel(carousel);
    var cards = Array.prototype.slice.call(root.querySelectorAll("[data-race-card]"));
    var usableCards = [];
    var currentCard = null;

    function parseCardData(card) {
      var script = card.querySelector(".race-data");
      if (!script) return null;
      try {
        return JSON.parse(script.textContent);
      } catch (error) {
        card.classList.add("has-data-error");
        return null;
      }
    }

    function renderMetrics(items) {
      if (!metrics) return;
      replaceChildren(metrics);
      (items || []).forEach(function (item) {
        var wrapper = document.createElement("div");
        var label = document.createElement("dt");
        var value = document.createElement("dd");
        setLocalizedElement(label, item.label);
        value.textContent = item.value || "";
        wrapper.appendChild(label);
        wrapper.appendChild(value);
        metrics.appendChild(wrapper);
      });
    }

    function selectCard(card) {
      if (!card || !card._raceData) return;
      currentCard = card;
      var data = card._raceData;

      cards.forEach(function (item) {
        var isSelected = item === card;
        item.classList.toggle("is-selected", isSelected);
        if (item.hasAttribute("aria-pressed")) item.setAttribute("aria-pressed", isSelected ? "true" : "false");
      });

      featured.dataset.currentRace = data.id || "";
      setLocalizedElement(title, data.name);
      setLocalizedElement(type, data.type);
      if (date) date.textContent = data.date || "";
      setLocalizedElement(name, data.name);
      setLocalizedElement(note, data.note);
      renderMetrics(data.metrics);
      if (carouselApi) carouselApi.setSlides(data.slides || [], data.ariaLabel);
    }

    cards.forEach(function (card) {
      var data = parseCardData(card);
      if (!data) return;
      card._raceData = data;
      usableCards.push(card);

      card.addEventListener("click", function () {
        selectCard(card);
      });

      card.addEventListener("keydown", function (event) {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        selectCard(card);
      });
    });

    if (!usableCards.length) return;

    var latestCard = usableCards.reduce(function (latest, card) {
      if (!latest) return card;
      return parseRaceTimestamp(card._raceData.date) > parseRaceTimestamp(latest._raceData.date) ? card : latest;
    }, null);
    var markedDefault = usableCards.find(function (card) { return card.hasAttribute("data-default-race"); });
    selectCard(latestCard || markedDefault || usableCards[0]);

    var langToggle = document.getElementById("lang-toggle");
    if (langToggle) {
      langToggle.addEventListener("click", function () {
        window.setTimeout(function () {
          if (currentCard) selectCard(currentCard);
        }, 0);
      });
    }
  }

  function init() {
    initCounters();
    initReveal();
    initCarousels();
    initRaceShowcase();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
