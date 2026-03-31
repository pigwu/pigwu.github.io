---
permalink: /
title: "About"
author_profile: true
classes: wide
pb_5k: "19:56"
pb_half_marathon: "1:33:34"
redirect_from:
  - /about/
  - /about.html
---

<div class="about-showcase">
  <section class="about-hero">
    <p class="about-kicker">Westlake University | Undergraduate Researcher</p>
    <h1>Yunzhi WU</h1>
    <p class="about-intro">
      I am an undergraduate student at Westlake University, based in Hangzhou, China.
      My research centers on <strong>world models</strong> and
      <strong>physical interaction driven by computer vision</strong>.
      I am excited by the idea of building agents that can understand dynamics, anticipate outcomes, and interact with the physical world in a grounded way.
    </p>
    <div class="focus-pills">
      <span>World Models</span>
      <span>Computer Vision</span>
      <span>Physical Interaction</span>
    </div>
  </section>

  <section class="about-panel reveal">
    <h2>Research Focus</h2>
    <div class="focus-grid">
      <article>
        <h3>Learning Dynamics</h3>
        <p>
          I am interested in models that capture how environments evolve over time and support prediction, planning, and robust decision-making.
        </p>
      </article>
      <article>
        <h3>Vision for Interaction</h3>
        <p>
          I study how visual perception can guide meaningful physical interaction, from object understanding to actionable feedback in real-world tasks.
        </p>
      </article>
    </div>
  </section>

  <section class="about-panel reveal">
    <h2>Personal Best Dashboard</h2>
    <p class="panel-note">Update the values in the front matter of <code>_pages/about.md</code> to show your latest records.</p>
    <div class="pb-grid">
      <article class="pb-card">
        <p class="pb-label">5K Personal Best</p>
        <p class="pb-value" data-target="{{ page.pb_5k }}">{{ page.pb_5k }}</p>
      </article>
      <article class="pb-card">
        <p class="pb-label">Half Marathon Personal Best</p>
        <p class="pb-value" data-target="{{ page.pb_half_marathon }}">{{ page.pb_half_marathon }}</p>
      </article>
    </div>
  </section>

  <section class="about-panel reveal">
    <h2>Race Photo Showcase</h2>
    <p class="panel-note">Auto-scrolling race memories from marathon, trail, and relay events.</p>
    <div class="race-carousel" aria-label="Race photo carousel">
      <div class="race-track">
        <figure class="race-slide">
          <img src="{{ '/images/races/race-01.jpg' | relative_url }}" alt="Trail race uphill section">
          <figcaption>Trail Donghai</figcaption>
        </figure>
        <figure class="race-slide">
          <img src="{{ '/images/races/race-02.jpg' | relative_url }}" alt="Trail race finish line">
          <figcaption>Trail Donghai Finish</figcaption>
        </figure>
        <figure class="race-slide">
          <img src="{{ '/images/races/race-03.jpg' | relative_url }}" alt="Relay handoff moment">
          <figcaption>Great Wall Relay League</figcaption>
        </figure>
        <figure class="race-slide">
          <img src="{{ '/images/races/race-04.jpg' | relative_url }}" alt="Track running training session">
          <figcaption>Track Session</figcaption>
        </figure>
        <figure class="race-slide">
          <img src="{{ '/images/races/race-05.jpg' | relative_url }}" alt="Half marathon in pink race kit">
          <figcaption>Tongxiang Half Marathon</figcaption>
        </figure>
        <figure class="race-slide">
          <img src="{{ '/images/races/race-06.jpg' | relative_url }}" alt="Half marathon finish area photo">
          <figcaption>Half Marathon Finish Area</figcaption>
        </figure>
        <figure class="race-slide">
          <img src="{{ '/images/races/race-07.jpg' | relative_url }}" alt="Post-race medal photo with teammate">
          <figcaption>Post-Race Medal Moment</figcaption>
        </figure>
        <figure class="race-slide">
          <img src="{{ '/images/races/race-08.jpg' | relative_url }}" alt="Westlake University race finish backdrop">
          <figcaption>Westlake University Race Day</figcaption>
        </figure>
        <figure class="race-slide">
          <img src="{{ '/images/races/race-09.jpg' | relative_url }}" alt="Race day photo with teammate">
          <figcaption>Race Day with Teammate</figcaption>
        </figure>
        <figure class="race-slide">
          <img src="{{ '/images/races/race-10.jpg' | relative_url }}" alt="Campus relay running moment">
          <figcaption>Campus Relay</figcaption>
        </figure>
      </div>
      <div class="race-controls">
        <button type="button" class="race-nav race-prev" aria-label="Previous race photo">&larr;</button>
        <button type="button" class="race-nav race-next" aria-label="Next race photo">&rarr;</button>
      </div>
      <div class="race-dots"></div>
    </div>
  </section>
</div>

<script>
  (function () {
    function parseTimeToSeconds(value) {
      if (!value) return null;
      var twoPart = /^\d{1,2}:\d{2}$/;
      var threePart = /^\d{1,2}:\d{2}:\d{2}$/;
      var parts = value.split(":").map(Number);

      if (twoPart.test(value)) {
        return parts[0] * 60 + parts[1];
      }

      if (threePart.test(value)) {
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
      }

      return null;
    }

    function formatSeconds(value, format) {
      if (format === "hh:mm:ss") {
        var hours = Math.floor(value / 3600);
        var minutes = Math.floor((value % 3600) / 60);
        var seconds = value % 60;
        return String(hours) + ":" + String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
      }

      var mm = Math.floor(value / 60);
      var ss = value % 60;
      return String(mm).padStart(2, "0") + ":" + String(ss).padStart(2, "0");
    }

    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18 });

    document.querySelectorAll(".about-showcase .reveal").forEach(function (item) {
      revealObserver.observe(item);
    });

    var hasAnimatedPb = false;
    function animatePbValues() {
      if (hasAnimatedPb) return;
      hasAnimatedPb = true;

      document.querySelectorAll(".pb-value").forEach(function (node) {
        var target = node.dataset.target || "";
        var totalSeconds = parseTimeToSeconds(target);
        var displayFormat = target.split(":").length === 3 ? "hh:mm:ss" : "mm:ss";

        if (totalSeconds === null) {
          node.textContent = target || "--:--";
          return;
        }

        var duration = 1200;
        var startAt = null;

        function step(timestamp) {
          if (!startAt) startAt = timestamp;
          var progress = Math.min((timestamp - startAt) / duration, 1);
          var current = Math.round(totalSeconds * progress);
          node.textContent = formatSeconds(current, displayFormat);
          if (progress < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
      });
    }

    var pbPanel = document.querySelector(".pb-grid");
    if (pbPanel) {
      var pbObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animatePbValues();
            pbObserver.disconnect();
          }
        });
      }, { threshold: 0.4 });

      pbObserver.observe(pbPanel);
    }

    var carousel = document.querySelector(".race-carousel");
    if (!carousel) return;

    var track = carousel.querySelector(".race-track");
    var originalSlides = Array.prototype.slice.call(track.querySelectorAll(".race-slide"));
    if (originalSlides.length === 0) return;

    var slideCount = originalSlides.length;
    if (slideCount > 1) {
      var firstClone = originalSlides[0].cloneNode(true);
      var lastClone = originalSlides[slideCount - 1].cloneNode(true);
      firstClone.classList.add("is-clone");
      lastClone.classList.add("is-clone");
      firstClone.setAttribute("aria-hidden", "true");
      lastClone.setAttribute("aria-hidden", "true");
      track.appendChild(firstClone);
      track.insertBefore(lastClone, track.firstChild);
    }

    var prevButton = carousel.querySelector(".race-prev");
    var nextButton = carousel.querySelector(".race-next");
    var dotsWrap = carousel.querySelector(".race-dots");
    var current = 0;
    var currentTrackIndex = slideCount > 1 ? 1 : 0;
    var timer = null;
    var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var pointerStartX = 0;
    var pointerDeltaX = 0;
    var isDragging = false;
    var dragStartTrackIndex = currentTrackIndex;
    var swipeThreshold = 52;

    function normalizeTrackIndex(index) {
      if (slideCount < 2) return 0;
      if (index === 0) return slideCount - 1;
      if (index === slideCount + 1) return 0;
      return index - 1;
    }

    function updateDots() {
      var dots = dotsWrap.querySelectorAll("button");
      dots.forEach(function (dot, idx) {
        dot.classList.toggle("is-active", idx === current);
      });
    }

    function applyTrackPosition(index, animated) {
      track.style.transition = animated ? "" : "none";
      track.style.transform = "translateX(-" + (index * 100) + "%)";
    }

    function syncStateWithTrack() {
      current = normalizeTrackIndex(currentTrackIndex);
      updateDots();
    }

    function stopAuto() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    function startAuto() {
      if (prefersReducedMotion || slideCount < 2) return;
      stopAuto();
      timer = setInterval(function () { goBy(1); }, 3200);
    }

    function restartAuto() {
      if (!prefersReducedMotion) startAuto();
    }

    function goToTrack(index) {
      if (slideCount < 2) return;
      currentTrackIndex = index;
      applyTrackPosition(currentTrackIndex, true);
      syncStateWithTrack();
    }

    function goBy(step) {
      if (slideCount < 2) return;
      goToTrack(currentTrackIndex + step);
    }

    function goTo(index) {
      var normalized = ((index % slideCount) + slideCount) % slideCount;
      if (slideCount < 2) {
        current = normalized;
        updateDots();
        return;
      }
      goToTrack(normalized + 1);
    }

    originalSlides.forEach(function (_, idx) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", "Go to race photo " + (idx + 1));
      dot.addEventListener("click", function () {
        goTo(idx);
        restartAuto();
      });
      dotsWrap.appendChild(dot);
    });

    if (prevButton) {
      prevButton.addEventListener("click", function () {
        goBy(-1);
        restartAuto();
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", function () {
        goBy(1);
        restartAuto();
      });
    }

    function beginDrag(clientX) {
      if (slideCount < 2) return;
      isDragging = true;
      dragStartTrackIndex = currentTrackIndex;
      pointerStartX = clientX;
      pointerDeltaX = 0;
      carousel.classList.add("is-dragging");
      track.style.transition = "none";
      stopAuto();
    }

    function moveDrag(clientX) {
      if (!isDragging) return;
      pointerDeltaX = clientX - pointerStartX;
      var offset = -dragStartTrackIndex * 100 + (pointerDeltaX / carousel.clientWidth) * 100;
      track.style.transform = "translateX(" + offset + "%)";
    }

    function endDrag() {
      if (!isDragging) return;
      isDragging = false;
      carousel.classList.remove("is-dragging");
      track.style.transition = "";

      if (Math.abs(pointerDeltaX) > swipeThreshold) {
        goToTrack(dragStartTrackIndex + (pointerDeltaX < 0 ? 1 : -1));
      } else {
        goToTrack(dragStartTrackIndex);
      }
      restartAuto();
    }

    carousel.addEventListener("pointerdown", function (event) {
      if (event.target.closest(".race-nav, .race-dots button")) return;
      if (event.pointerType === "mouse" && event.button !== 0) return;
      beginDrag(event.clientX);
      carousel.setPointerCapture(event.pointerId);
    });

    carousel.addEventListener("pointermove", function (event) {
      moveDrag(event.clientX);
    });

    carousel.addEventListener("pointerup", endDrag);
    carousel.addEventListener("pointercancel", endDrag);
    carousel.addEventListener("pointerleave", function () {
      if (isDragging) endDrag();
    });

    if (slideCount > 1) {
      track.addEventListener("transitionend", function () {
        if (currentTrackIndex === 0) {
          currentTrackIndex = slideCount;
          applyTrackPosition(currentTrackIndex, false);
        } else if (currentTrackIndex === slideCount + 1) {
          currentTrackIndex = 1;
          applyTrackPosition(currentTrackIndex, false);
        }
        syncStateWithTrack();
      });
    }

    applyTrackPosition(currentTrackIndex, false);
    syncStateWithTrack();

    startAuto();
    carousel.addEventListener("mouseenter", stopAuto);
    carousel.addEventListener("mouseleave", startAuto);
  })();
</script>
