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
    <p class="about-kicker" data-en="Westlake University | Undergraduate Researcher" data-zh="西湖大学 | 本科生研究员">Westlake University | Undergraduate Researcher</p>
    <h1>Yunzhi WU</h1>
    <p class="about-intro" data-en="I am an undergraduate student at Westlake University, based in Hangzhou, China. I am advised by Anpei Chen in the Inception 3D Lab. My research centers on world models and physical interaction driven by computer vision. I am excited by the idea of building agents that can understand dynamics, anticipate outcomes, and interact with the physical world in a grounded way." data-zh="我是西湖大学的本科生，位于中国杭州。我在Inception 3D实验室接受陈安培的指导。我的研究集中在世界模型和由计算机视觉驱动的物理交互。我对构建能够理解动态、预测结果并以扎实的方式与物理世界交互的智能体感到兴奋。">
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
  </section>

  <section class="about-panel reveal">
    <h2 data-en="Research Focus" data-zh="研究方向">Research Focus</h2>
    <div class="focus-grid">
      <article>
        <h3 data-en="Learning Dynamics" data-zh="学习动态">Learning Dynamics</h3>
        <p data-en="I am interested in models that capture how environments evolve over time and support prediction, planning, and robust decision-making." data-zh="我对捕捉环境如何随时间演变并支持预测、规划和稳健决策的模型感兴趣。">
          I am interested in models that capture how environments evolve over time and support prediction, planning, and robust decision-making.
        </p>
      </article>
      <article>
        <h3 data-en="Vision for Interaction" data-zh="交互视觉">Vision for Interaction</h3>
        <p data-en="I study how visual perception can guide meaningful physical interaction, from object understanding to actionable feedback in real-world tasks." data-zh="我研究视觉感知如何指导有意义的物理交互，从物体理解到现实世界任务中的可操作反馈。">
          I study how visual perception can guide meaningful physical interaction, from object understanding to actionable feedback in real-world tasks.
        </p>
      </article>
    </div>
  </section>
</div>

<script>
  (function () {
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
  })();
</script>
