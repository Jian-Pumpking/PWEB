# Jianbin Portfolio (GitHub Pages)

一个可直接部署到 GitHub Pages 的中英混合个人网站模板，包含：

- 酷炫动态背景（Starfield）
- 鼠标动态效果（视差 + 光晕 + cursor trail）
- 卡通头像（可替换）
- Vue 3 本地运行时（无构建流程）
- 数据驱动内容（后续只改 data/*.js）

## 项目结构

```text
.
├─ index.html
├─ blog
│  └─ post.html
├─ assets
│  ├─ css
│  │  ├─ style.css
│  │  └─ post.css
│  ├─ js
│  │  ├─ main.js
│  │  └─ post.js
│  ├─ vendor
│  │  └─ vue.global.prod.js
│  └─ images
│     └─ avatar-jianbin-cartoon.svg
├─ data
│  ├─ site.js
│  ├─ projects.js
│  ├─ blogs.js
│  ├─ site.json
│  ├─ projects.json
│  └─ blogs.json
├─ .nojekyll
└─ README.md
```

## 最常改的文件（推荐）

1. `data/site.js`
- 个人信息：名字、标题、简介、邮箱、GitHub
- 技能标签：`skills`
- 首页数据卡：`highlights`

2. `data/projects.js`
- 项目列表（标题、简介、链接、标签）

3. `data/blogs.js`
- 博客列表和正文（id、标题、日期、简介、标签、content）
- 详情页地址规则：`blog/post.html?id=你的id`

## 技术说明

- 当前使用 Vue 3（无构建版），文件在 `assets/vendor/vue.global.prod.js`
- 适合 GitHub Pages，静态部署即可运行，无需 npm 构建流程
- 现在支持直接双击 `index.html` 以 `file://` 打开（不再依赖 fetch JSON）

## 部署到 GitHub Pages

1. 新建仓库并上传全部文件
2. 打开仓库 `Settings -> Pages`
3. 在 `Build and deployment` 中：
- Source 选 `Deploy from a branch`
- Branch 选 `main`
- Folder 选 `/ (root)`
4. 保存，等待部署完成
