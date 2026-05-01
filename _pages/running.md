---
layout: archive
title: "Running"
permalink: /running/
author_profile: true
---

<div class="running-page">
  <section class="running-intro">
    <h2 data-en="Personal Best Records" data-zh="个人最佳成绩">Personal Best Records</h2>
    <div class="pb-grid">
      <div class="pb-card">
        <p class="pb-label" data-en="5K Personal Best" data-zh="5公里最佳">5K Personal Best</p>
        <p class="pb-value" data-target="19:56">19:56</p>
      </div>
      <div class="pb-card">
        <p class="pb-label" data-en="Half Marathon Personal Best" data-zh="半程马拉松最佳">Half Marathon Personal Best</p>
        <p class="pb-value" data-target="1:33:34">1:33:34</p>
      </div>
    </div>
  </section>

  <section class="race-section">
    <h2 data-en="Marathon Races" data-zh="马拉松比赛">Marathon Races</h2>
    <p class="section-note" data-en="Add your marathon race results here" data-zh="在此添加您的马拉松比赛成绩">Add your marathon race results here</p>
    <div class="races-grid" id="marathon-races">
      <!-- Example race card - duplicate and modify for each race -->
      <!-- 
      <article class="race-card">
        <div class="race-image">
          <img src="/images/races/marathon-example.jpg" alt="Race name">
        </div>
        <div class="race-details">
          <h3 class="race-name" data-en="Race Name" data-zh="比赛名称">Race Name</h3>
          <p class="race-date" data-en="Date: 2024-01-01" data-zh="日期：2024-01-01">Date: 2024-01-01</p>
          <p class="race-time" data-en="Time: 3:30:00" data-zh="成绩：3:30:00">Time: 3:30:00</p>
          <p class="race-distance" data-en="Distance: 42.195km" data-zh="距离：42.195公里">Distance: 42.195km</p>
          <p class="race-notes" data-en="Notes about the race" data-zh="比赛备注">Notes about the race</p>
        </div>
      </article>
      -->
    </div>
  </section>

  <section class="race-section">
    <h2 data-en="Trail Running Races" data-zh="越野跑比赛">Trail Running Races</h2>
    <p class="section-note" data-en="Add your trail running race results here" data-zh="在此添加您的越野跑比赛成绩">Add your trail running race results here</p>
    <div class="races-grid" id="trail-races">
      <!-- Example: Trail race from your photos -->
      <article class="race-card">
        <div class="race-image">
          <img src="/images/races/race-01.jpg" alt="Trail Donghai">
        </div>
        <div class="race-details">
          <h3 class="race-name" data-en="Trail Donghai" data-zh="东海越野">Trail Donghai</h3>
          <p class="race-date" data-en="Date: TBD" data-zh="日期：待定">Date: TBD</p>
          <p class="race-time" data-en="Time: TBD" data-zh="成绩：待定">Time: TBD</p>
          <p class="race-distance" data-en="Distance: TBD" data-zh="距离：待定">Distance: TBD</p>
        </div>
      </article>
    </div>
  </section>

  <section class="race-section">
    <h2 data-en="Relay & Team Races" data-zh="接力赛与团队赛">Relay & Team Races</h2>
    <p class="section-note" data-en="Add your relay and team race results here" data-zh="在此添加您的接力赛和团队赛成绩">Add your relay and team race results here</p>
    <div class="races-grid" id="relay-races">
      <!-- Example: Relay race from your photos -->
      <article class="race-card">
        <div class="race-image">
          <img src="/images/races/race-03.jpg" alt="Great Wall Relay League">
        </div>
        <div class="race-details">
          <h3 class="race-name" data-en="Great Wall Relay League" data-zh="长城接力联赛">Great Wall Relay League</h3>
          <p class="race-date" data-en="Date: TBD" data-zh="日期：待定">Date: TBD</p>
          <p class="race-time" data-en="Time: TBD" data-zh="成绩：待定">Time: TBD</p>
          <p class="race-notes" data-en="Team relay event" data-zh="团队接力赛">Team relay event</p>
        </div>
      </article>
    </div>
  </section>
</div>

<style>
.running-page {
  max-width: 1200px;
  margin: 0 auto;
}

.running-intro {
  margin-bottom: 3rem;
}

.pb-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.pb-card {
  background: var(--background-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
}

.pb-label {
  font-size: 0.9rem;
  color: var(--muted-text-color);
  margin-bottom: 0.5rem;
}

.pb-value {
  font-size: 2rem;
  font-weight: bold;
  color: var(--link-color);
}

.race-section {
  margin-bottom: 3rem;
}

.race-section h2 {
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

.section-note {
  font-style: italic;
  color: var(--muted-text-color);
  margin-bottom: 1.5rem;
}

.races-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.race-card {
  background: var(--background-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.race-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.race-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.race-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.race-details {
  padding: 1.5rem;
}

.race-name {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.race-date, .race-time, .race-distance, .race-notes {
  font-size: 0.9rem;
  margin: 0.3rem 0;
  color: var(--muted-text-color);
}
</style>

<script>
(function() {
  function parseTimeToSeconds(value) {
    if (!value) return null;
    var parts = value.split(":").map(Number);
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

  var hasAnimated = false;
  function animatePB() {
    if (hasAnimated) return;
    hasAnimated = true;

    document.querySelectorAll(".pb-value").forEach(function(el) {
      var target = el.dataset.target;
      var totalSeconds = parseTimeToSeconds(target);
      var format = target.split(":").length === 3 ? "hh:mm:ss" : "mm:ss";
      
      if (!totalSeconds) return;

      var start = null;
      var duration = 1200;

      function step(timestamp) {
        if (!start) start = timestamp;
        var progress = Math.min((timestamp - start) / duration, 1);
        var current = Math.round(totalSeconds * progress);
        el.textContent = formatSeconds(current, format);
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        animatePB();
        observer.disconnect();
      }
    });
  }, { threshold: 0.4 });

  var pbGrid = document.querySelector(".pb-grid");
  if (pbGrid) observer.observe(pbGrid);
})();
</script>
