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

  function initCarousels() {
    document.querySelectorAll(".race-image-carousel").forEach(function (carousel) {
      var images = Array.prototype.slice.call(carousel.querySelectorAll(".race-images img"));
      var prevBtn = carousel.querySelector(".carousel-btn.prev");
      var nextBtn = carousel.querySelector(".carousel-btn.next");
      var dotsWrap = carousel.querySelector(".carousel-dots");
      var thumbsWrap = carousel.querySelector(".carousel-thumbs");
      var status = carousel.querySelector(".carousel-status");
      var caption = carousel.querySelector(".carousel-caption");
      var currentIndex = Math.max(0, images.findIndex(function (img) { return img.classList.contains("active"); }));
      var timer = null;
      var paused = false;
      var startX = 0;
      var startY = 0;
      var autoplay = carousel.dataset.autoplay === "true" && images.length > 1;
      var interval = Number(carousel.dataset.interval || 5000);
      var dots = [];
      var thumbs = [];

      if (!images.length) return;

      function currentLanguage() {
        return document.documentElement.getAttribute("lang") === "zh" ? "zh" : "en";
      }

      function captionFor(index, lang) {
        if (lang === "zh") {
          return images[index].dataset.captionZh || images[index].dataset.caption || images[index].alt || "";
        }
        return images[index].dataset.caption || images[index].alt || "";
      }

      function setCaption(index) {
        if (!caption) return;
        var enText = captionFor(index, "en");
        var zhText = captionFor(index, "zh");
        var text = currentLanguage() === "zh" ? zhText : enText;
        caption.textContent = text;
        caption.setAttribute("data-en", enText);
        caption.setAttribute("data-zh", zhText);
      }

      function refreshCaption() {
        setCaption(currentIndex);
      }

      function setActive(index) {
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
        if (!autoplay || paused) return;
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

      function buildControls() {
        if (images.length <= 1) {
          [prevBtn, nextBtn, dotsWrap, thumbsWrap, status].forEach(function (el) {
            if (el) el.hidden = true;
          });
          setActive(0);
          return;
        }

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

      buildControls();
      setActive(currentIndex);
      startTimer();
    });
  }

  function init() {
    initCounters();
    initReveal();
    initCarousels();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
