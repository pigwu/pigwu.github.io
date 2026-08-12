# Yunzhi Site Studio

This folder contains a local-only content editor for the Jekyll site.

## Start

Double-click `start-admin.cmd` at the repository root, or run:

```powershell
node admin/server.js
```

The editor opens at `http://127.0.0.1:4173`. It only listens on localhost and is excluded from the deployed Jekyll site.

## What it manages

- Profile, avatar, About text, personal bests, and running summary in `_data/site_content.json`
- Blog Markdown files under `_posts/` and images under `images/blog/`
- Running entries in `_data/running_entries.json` and images under `images/races/`
- An exact list of uploaded assets in `_data/editor_assets.json`
- Git commit and push of editor-managed paths to `origin/main`

The publish action intentionally stages only editor-managed paths. Unrelated working-tree changes are left untouched.
