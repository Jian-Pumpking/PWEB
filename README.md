# Jianbin Portfolio (GitHub Pages)

一个可直接部署到 GitHub Pages 的中英混合个人网站模板，包含：

- 酷炫动态背景（Starfield）
- 卡通头像（可替换）
- 数据驱动内容（后续只改 JSON）
- 响应式布局（Desktop + Mobile）

## 项目结构

```text
.
├─ index.html
├─ assets
│  ├─ css
│  │  └─ style.css
│  ├─ js
│  │  └─ main.js
│  └─ images
│     └─ avatar-jianbin-cartoon.svg
├─ data
│  ├─ site.json
│  └─ projects.json
└─ README.md
```

## 你最常改的文件

1. `data/site.json`
- 个人信息：名字、标题、简介、邮箱、GitHub
- 技能标签：`skills`
- 首页数据卡：`highlights`

2. `data/projects.json`
- 项目列表（标题、简介、链接、标签）

3. `assets/images/avatar-jianbin-cartoon.svg`
- 头像文件（可替换成 PNG/JPG/SVG）
- 如果替换，请同步修改 `index.html` 里的 `img src`

## 部署到 GitHub Pages

1. 新建仓库并上传全部文件
2. 打开仓库 `Settings -> Pages`
3. 在 `Build and deployment` 中：
   - Source 选 `Deploy from a branch`
   - Branch 选 `main`
   - Folder 选 `/ (root)`
4. 保存，等待部署完成

## 本地预览（可选）

建议用本地静态服务（因为页面会读取 `data/*.json`）：

```bash
# Node 环境
npx serve .

# Python 环境
python -m http.server 8080
```

然后打开浏览器访问提示的本地地址。
