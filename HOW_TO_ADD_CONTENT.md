# 如何添加内容 / How to Add Content

## 添加博客文章 / Adding Blog Posts

### 中文说明：
1. 在 `_posts` 目录下创建新文件
2. 文件命名格式：`YYYY-MM-DD-title.md`（例如：`2024-05-01-my-first-post.md`）
3. 文件开头添加以下内容：

```markdown
---
title: "文章标题"
date: 2024-05-01
permalink: /posts/2024/05/my-first-post/
tags:
  - 标签1
  - 标签2
---

这里写你的文章内容...
```

### English Instructions:
1. Create a new file in the `_posts` directory
2. File naming format: `YYYY-MM-DD-title.md` (e.g., `2024-05-01-my-first-post.md`)
3. Add the following at the beginning of the file:

```markdown
---
title: "Your Post Title"
date: 2024-05-01
permalink: /posts/2024/05/my-first-post/
tags:
  - tag1
  - tag2
---

Write your post content here...
```

---

## 添加跑步比赛记录 / Adding Running Race Records

### 中文说明：

#### 1. 准备比赛照片
- 将比赛照片放入 `images/races/` 目录
- 建议命名格式：`marathon-2024-hangzhou.jpg` 或 `trail-2024-donghai.jpg`

#### 2. 编辑跑步页面
打开文件：`_pages/running.md`

#### 3. 添加马拉松比赛
在 `<div class="races-grid" id="marathon-races">` 标签内添加：

```html
<article class="race-card">
  <div class="race-image">
    <img src="/images/races/marathon-2024-hangzhou.jpg" alt="2024杭州马拉松">
  </div>
  <div class="race-details">
    <h3 class="race-name" data-en="2024 Hangzhou Marathon" data-zh="2024杭州马拉松">2024 Hangzhou Marathon</h3>
    <p class="race-date" data-en="Date: 2024-11-03" data-zh="日期：2024-11-03">Date: 2024-11-03</p>
    <p class="race-time" data-en="Time: 3:30:45" data-zh="成绩：3:30:45">Time: 3:30:45</p>
    <p class="race-distance" data-en="Distance: 42.195km" data-zh="距离：42.195公里">Distance: 42.195km</p>
    <p class="race-notes" data-en="Great weather, personal best!" data-zh="天气很好，个人最佳成绩！">Great weather, personal best!</p>
  </div>
</article>
```

#### 4. 添加越野跑比赛
在 `<div class="races-grid" id="trail-races">` 标签内添加：

```html
<article class="race-card">
  <div class="race-image">
    <img src="/images/races/trail-2024-moganshan.jpg" alt="2024莫干山越野">
  </div>
  <div class="race-details">
    <h3 class="race-name" data-en="2024 Moganshan Trail" data-zh="2024莫干山越野">2024 Moganshan Trail</h3>
    <p class="race-date" data-en="Date: 2024-10-15" data-zh="日期：2024-10-15">Date: 2024-10-15</p>
    <p class="race-time" data-en="Time: 2:45:30" data-zh="成绩：2:45:30">Time: 2:45:30</p>
    <p class="race-distance" data-en="Distance: 25km, Elevation: 1200m" data-zh="距离：25公里，爬升：1200米">Distance: 25km, Elevation: 1200m</p>
    <p class="race-notes" data-en="Challenging terrain, beautiful views" data-zh="地形挑战性强，风景优美">Challenging terrain, beautiful views</p>
  </div>
</article>
```

#### 5. 添加接力赛/团队赛
在 `<div class="races-grid" id="relay-races">` 标签内添加：

```html
<article class="race-card">
  <div class="race-image">
    <img src="/images/races/relay-2024-westlake.jpg" alt="2024西湖接力赛">
  </div>
  <div class="race-details">
    <h3 class="race-name" data-en="2024 Westlake Relay" data-zh="2024西湖接力赛">2024 Westlake Relay</h3>
    <p class="race-date" data-en="Date: 2024-09-20" data-zh="日期：2024-09-20">Date: 2024-09-20</p>
    <p class="race-time" data-en="Team Time: 1:45:20" data-zh="团队成绩：1:45:20">Team Time: 1:45:20</p>
    <p class="race-notes" data-en="4-person relay, 5km each leg" data-zh="4人接力，每人5公里">4-person relay, 5km each leg</p>
  </div>
</article>
```

### English Instructions:

#### 1. Prepare Race Photos
- Place race photos in the `images/races/` directory
- Suggested naming format: `marathon-2024-hangzhou.jpg` or `trail-2024-donghai.jpg`

#### 2. Edit Running Page
Open file: `_pages/running.md`

#### 3. Add Marathon Race
Inside the `<div class="races-grid" id="marathon-races">` tag, add:

```html
<article class="race-card">
  <div class="race-image">
    <img src="/images/races/marathon-2024-hangzhou.jpg" alt="2024 Hangzhou Marathon">
  </div>
  <div class="race-details">
    <h3 class="race-name" data-en="2024 Hangzhou Marathon" data-zh="2024杭州马拉松">2024 Hangzhou Marathon</h3>
    <p class="race-date" data-en="Date: 2024-11-03" data-zh="日期：2024-11-03">Date: 2024-11-03</p>
    <p class="race-time" data-en="Time: 3:30:45" data-zh="成绩：3:30:45">Time: 3:30:45</p>
    <p class="race-distance" data-en="Distance: 42.195km" data-zh="距离：42.195公里">Distance: 42.195km</p>
    <p class="race-notes" data-en="Great weather, personal best!" data-zh="天气很好，个人最佳成绩！">Great weather, personal best!</p>
  </div>
</article>
```

#### 4. Add Trail Running Race
Inside the `<div class="races-grid" id="trail-races">` tag, add the race card with similar structure.

#### 5. Add Relay/Team Race
Inside the `<div class="races-grid" id="relay-races">` tag, add the race card with similar structure.

---

## 重要提示 / Important Notes

### 中文：
- **data-en** 和 **data-zh** 属性：这些属性用于中英文切换功能。`data-en` 是英文内容，`data-zh` 是中文内容。
- 标签内的默认文本应该是英文（因为默认语言是英文）
- 所有带有 `data-en` 和 `data-zh` 的元素会在点击语言切换按钮时自动切换

### English:
- **data-en** and **data-zh** attributes: These attributes are used for language switching. `data-en` is English content, `data-zh` is Chinese content.
- The default text inside tags should be English (since the default language is English)
- All elements with `data-en` and `data-zh` will automatically switch when clicking the language toggle button

---

## 测试网站 / Testing the Website

### 本地测试 / Local Testing:

```bash
# 安装依赖 / Install dependencies
bundle install

# 启动本地服务器 / Start local server
bundle exec jekyll serve

# 访问 / Visit: http://localhost:4000
```

### 部署到 GitHub Pages / Deploy to GitHub Pages:

```bash
git add .
git commit -m "Add new content"
git push origin main
```

网站会自动部署到 GitHub Pages。
The website will automatically deploy to GitHub Pages.
