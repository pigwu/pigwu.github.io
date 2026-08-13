---
permalink: /
title: "About"
author_profile: true
classes: wide
redirect_from:
  - /about/
  - /about.html
---

{% assign managed_profile = site.data.site_content.profile %}
{% assign managed_about = site.data.site_content.about %}

<div class="about-showcase">
  <section class="about-hero">
    <div class="about-hero__copy">
      <p class="about-kicker" data-en="{{ managed_about.kicker_en | escape }}" data-zh="{{ managed_about.kicker_zh | escape }}">{{ managed_about.kicker_en }}</p>
      <h1>{{ managed_profile.name }}</h1>
      <p class="about-intro" data-en="{{ managed_about.intro_en | escape }}" data-zh="{{ managed_about.intro_zh | escape }}">{{ managed_about.intro_en }}</p>
      <div class="focus-pills">
        <span data-en="World Models" data-zh="世界模型">World Models</span>
        <span data-en="Computer Vision" data-zh="计算机视觉">Computer Vision</span>
        <span data-en="Physical Interaction" data-zh="物理交互">Physical Interaction</span>
      </div>
    </div>

    <div class="about-signal-grid" aria-label="Research signals">
      <div>
        <span data-en="Lab" data-zh="实验室">Lab</span>
        <strong>Inception 3D</strong>
      </div>
      <div>
        <span data-en="Focus" data-zh="方向">Focus</span>
        <strong>World Models</strong>
      </div>
      <div>
        <span data-en="Mode" data-zh="模式">Mode</span>
        <strong>Vision + Action</strong>
      </div>
      <div>
        <span data-en="Base" data-zh="地点">Base</span>
        <strong>Hangzhou</strong>
      </div>
    </div>
  </section>

  <section class="about-panel reveal">
    <div class="panel-heading">
      <p data-en="Research vectors" data-zh="研究向量">Research vectors</p>
      <h2 data-en="Research Focus" data-zh="研究方向">Research Focus</h2>
    </div>
    <div class="focus-grid">
      <article>
        <span>01</span>
        <h3 data-en="Learning Dynamics" data-zh="学习动态">Learning Dynamics</h3>
        <p data-en="I am interested in models that capture how environments evolve over time and support prediction, planning, and robust decision-making." data-zh="我对捕捉环境如何随时间演变，并支持预测、规划和稳健决策的模型感兴趣。">
          I am interested in models that capture how environments evolve over time and support prediction, planning, and robust decision-making.
        </p>
      </article>
      <article>
        <span>02</span>
        <h3 data-en="Vision for Interaction" data-zh="交互视觉">Vision for Interaction</h3>
        <p data-en="I study how visual perception can guide meaningful physical interaction, from object understanding to actionable feedback in real-world tasks." data-zh="我研究视觉感知如何指导有意义的物理交互，从物体理解到现实任务中的可操作反馈。">
          I study how visual perception can guide meaningful physical interaction, from object understanding to actionable feedback in real-world tasks.
        </p>
      </article>
    </div>
  </section>

  <section class="about-panel reveal">
    <div class="panel-heading">
      <p data-en="Recent output" data-zh="近期工作">Recent output</p>
      <h2 data-en="Recent Work" data-zh="近期工作">Recent Work</h2>
    </div>
    <article class="project-card">
      <div>
        <span data-en="System" data-zh="系统">System</span>
        <h3 data-en="ARPoseStreamer" data-zh="ARPoseStreamer">ARPoseStreamer</h3>
      </div>
      <p data-en="A real-time AR pose streaming system that captures and transmits human pose data from iOS devices. This project enables seamless integration of AR-based pose estimation for research and interactive applications." data-zh="一个实时 AR 姿态流传输系统，可从 iOS 设备捕获并传输人体姿态数据。该项目为研究和交互应用提供基于 AR 的姿态估计无缝集成。">
        A real-time AR pose streaming system that captures and transmits human pose data from iOS devices. This project enables seamless integration of AR-based pose estimation for research and interactive applications.
      </p>
      <a href="https://github.com/pigwu/ARPoseStreamer" target="_blank" rel="noopener" class="project-link" data-en="View on GitHub" data-zh="在 GitHub 上查看">View on GitHub</a>
    </article>

    <article class="project-card">
      <div>
        <span data-en="Diagnostics" data-zh="诊断工具">Diagnostics</span>
        <h3 data-en="iPhone UDP Packet Loss Monitor" data-zh="iPhone UDP Packet Loss Monitor">iPhone UDP Packet Loss Monitor</h3>
      </div>
      <p data-en="A focused desktop dashboard for measuring real-time UDP packet loss from iPhone ARKit pose streams, including missing packets, rolling FPS, sequence gaps, latency, jitter, duplicates, and out-of-order diagnostics." data-zh="一个面向 iPhone ARKit 姿态流的桌面诊断面板，用于实时测量 UDP 丢包率、缺失包、滚动 FPS、序列跳变、延迟、抖动、重复包和乱序包。">
        A focused desktop dashboard for measuring real-time UDP packet loss from iPhone ARKit pose streams, including missing packets, rolling FPS, sequence gaps, latency, jitter, duplicates, and out-of-order diagnostics.
      </p>
      <a href="https://github.com/pigwu/iPhoneUDPPacketLossMonitor" target="_blank" rel="noopener" class="project-link" data-en="View on GitHub" data-zh="在 GitHub 上查看">View on GitHub</a>
    </article>

    <article class="project-card">
      <div>
        <span data-en="Validation" data-zh="验证工具">Validation</span>
        <h3 data-en="iPhone Trajectory Validator" data-zh="iPhone Trajectory Validator">iPhone Trajectory Validator</h3>
      </div>
      <p data-en="An offline GUI and command-line workflow for validating iPhone ARKit trajectory accuracy against reference robot logs, producing trajectory overlap plots, axis error curves, error histograms, and numeric evaluation metrics." data-zh="一个离线 GUI 与命令行工具，用参考机器人日志验证 iPhone ARKit 轨迹精度，并输出轨迹重叠图、轴向误差曲线、误差直方图和数值评估指标。">
        An offline GUI and command-line workflow for validating iPhone ARKit trajectory accuracy against reference robot logs, producing trajectory overlap plots, axis error curves, error histograms, and numeric evaluation metrics.
      </p>
      <a href="https://github.com/pigwu/iPhoneTrajectoryValidator" target="_blank" rel="noopener" class="project-link" data-en="View on GitHub" data-zh="在 GitHub 上查看">View on GitHub</a>
    </article>
  </section>

  {% assign guestbook = site.data.site_content.engagement.guestbook %}
  {% if guestbook.enabled %}
  <section class="about-panel guestbook-panel reveal" id="guestbook">
    <div class="guestbook-heading">
      <div class="panel-heading">
        <p data-en="OPEN CHANNEL" data-zh="开放频道">OPEN CHANNEL</p>
        <h2 data-en="{{ guestbook.title_en | escape }}" data-zh="{{ guestbook.title_zh | escape }}">{{ guestbook.title_en }}</h2>
      </div>
      <div class="guestbook-intro">
        <p data-en="{{ guestbook.intro_en | escape }}" data-zh="{{ guestbook.intro_zh | escape }}">{{ guestbook.intro_en }}</p>
        <a class="guestbook-write" href="https://github.com/{{ guestbook.owner }}/{{ guestbook.repo }}/issues/{{ guestbook.issue }}#new_comment_field" target="_blank" rel="noopener" data-en="{{ guestbook.button_en | escape }}" data-zh="{{ guestbook.button_zh | escape }}">{{ guestbook.button_en }}</a>
      </div>
    </div>
    <div
      id="guestbook-comments"
      class="guestbook-comments"
      data-owner="{{ guestbook.owner | escape }}"
      data-repo="{{ guestbook.repo | escape }}"
      data-issue="{{ guestbook.issue }}"
      data-limit="{{ guestbook.max_comments | default: 6 }}"
      data-sort="{{ guestbook.sort | default: 'newest' }}"
      data-empty-en="No messages yet. You could leave the first one."
      data-empty-zh="还没有留言，你可以成为第一个。"
      data-error-en="Messages could not be loaded right now. You can still open the guestbook on GitHub."
      data-error-zh="暂时无法读取留言，你仍可前往 GitHub 打开留言板。"
    >
      <div class="guestbook-status" data-en="Tuning into the guestbook..." data-zh="正在读取留言……">Tuning into the guestbook...</div>
    </div>
    <p class="guestbook-moderation" data-en="{{ guestbook.moderation_en | escape }}" data-zh="{{ guestbook.moderation_zh | escape }}">{{ guestbook.moderation_en }}</p>
  </section>
  {% endif %}
</div>

<script>
  (function () {
    var items = document.querySelectorAll(".about-showcase .reveal");
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
    }, { threshold: 0.18 });

    items.forEach(function (item) {
      revealObserver.observe(item);
    });
  })();
</script>
{% if guestbook.enabled %}<script src="{{ '/assets/js/guestbook.js' | relative_url }}" defer></script>{% endif %}
