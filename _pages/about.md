---
permalink: /
title: "About"
author_profile: true
classes: wide
redirect_from:
  - /about/
  - /about.html
---

<div class="about-showcase">
  <section class="about-hero">
    <div class="about-hero__copy">
      <p class="about-kicker" data-en="Westlake University | Undergraduate Researcher" data-zh="西湖大学 | 本科生研究员">Westlake University | Undergraduate Researcher</p>
      <h1>Yunzhi WU</h1>
      <p class="about-intro" data-en="I am an undergraduate student at Westlake University, based in Hangzhou, China. I am advised by Anpei Chen in the Inception 3D Lab. My research centers on world models and physical interaction driven by computer vision. I am excited by the idea of building agents that can understand dynamics, anticipate outcomes, and interact with the physical world in a grounded way." data-zh="我是西湖大学的本科生，位于中国杭州。我在 Inception 3D 实验室接受陈安培的指导。我的研究集中在世界模型和由计算机视觉驱动的物理交互。我对构建能够理解动态、预测结果并以扎实方式与物理世界交互的智能体感到兴奋。">
        I am an undergraduate student at Westlake University, based in Hangzhou, China.
        I am advised by <strong>Anpei Chen</strong> in the <strong>Inception 3D Lab</strong>.
        My research centers on <strong>world models</strong> and
        <strong>physical interaction driven by computer vision</strong>.
        I am excited by the idea of building agents that can understand dynamics, anticipate outcomes, and interact with the physical world in a grounded way.
      </p>
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
  </section>
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
