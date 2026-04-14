# Jianbin Portfolio (GitHub Pages)

一个可直接部署到 GitHub Pages 的中英混合个人网站模板，包含：

- 酷炫动态背景（Starfield）
- 鼠标动态效果（视差 + 光晕 + cursor trail）
- 卡通头像（可替换）
- Vue 3 本地运行时（无构建流程）
- 数据驱动内容（后续只改 data/*.js）
- 本地 CMS 后台（可发布文章、上传图片）

## 项目结构

```text
.
├─ index.html
├─ blog
│  ├─ index.html
│  └─ post.html
├─ admin
│  ├─ index.html
│  └─ app.js
├─ assets
│  ├─ css
│  │  ├─ style.css
│  │  ├─ blog.css
│  │  └─ post.css
│  ├─ js
│  │  ├─ main.js
│  │  ├─ blog.js
│  │  └─ post.js
│  ├─ vendor
│  │  └─ vue.global.prod.js
│  └─ images
│     └─ blog
├─ data
│  ├─ site.js
│  ├─ projects.js
│  ├─ blogs.js
│  ├─ site.json
│  ├─ projects.json
│  └─ blogs.json
├─ cms-server.js
├─ package.json
├─ .nojekyll
└─ README.md
```

## 本地后台 CMS（新增）

1. 安装依赖（首次）
```bash
npm install
```

2. 启动后台
```bash
npm run cms
```

3. 打开后台页面
- `http://localhost:4321/admin`
- 默认密码：`123456`

4. 后台能力
- 新建/编辑/删除文章
- 上传图片到 `assets/images/blog/`
- 自动更新 `data/blogs.js`（前台立即可读）
- 同步写入 `data/blogs.json`

5. 发布到 GitHub Pages
- 在后台改完内容后，执行：
```bash
git add .
git commit -m "update blog content"
git push
```

## 安全建议

- 生产环境请修改后台密码（环境变量 `CMS_PASSWORD`）
- 本方案是本地写作后台，GitHub Pages 仍是静态托管

## 你最常改的文件（手动方式）

1. `data/site.js`
- 个人信息：名字、标题、简介、邮箱、GitHub
- 技能标签：`skills`
- 首页数据卡：`highlights`

2. `data/projects.js`
- 项目列表（标题、简介、链接、标签）

3. `data/blogs.js`
- 博客列表和正文（id、标题、日期、简介、标签、content）
- 图片字段：`thumb`（列表图）、`cover`（详情封面）、`gallery`（图集）
- 详情页地址规则：`blog/post.html?id=你的id`
