---
layout: archive
title: "Blog"
permalink: /blog/
author_profile: true
---

<div class="blog-page">
  <section class="blog-intro">
    <h2 data-en="Recent Posts" data-zh="最新文章">Recent Posts</h2>
    <p data-en="Thoughts, experiences, and reflections" data-zh="思考、经历与感悟">Thoughts, experiences, and reflections</p>
  </section>

  {% for post in site.posts %}
    {% include archive-single.html %}
  {% endfor %}
</div>

<style>
.blog-page {
  max-width: 900px;
  margin: 0 auto;
}

.blog-intro {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--border-color);
}

.blog-intro h2 {
  margin-bottom: 0.5rem;
}

.blog-intro p {
  color: var(--muted-text-color);
  font-style: italic;
}
</style>
