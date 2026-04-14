const fs = require("fs");
const path = require("path");
const vm = require("vm");
const express = require("express");
const multer = require("multer");

const app = express();
const PORT = process.env.CMS_PORT || 4321;
const CMS_PASSWORD = process.env.CMS_PASSWORD || "123456";

const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, "data");
const BLOGS_JS = path.join(DATA_DIR, "blogs.js");
const BLOGS_JSON = path.join(DATA_DIR, "blogs.json");
const BLOG_IMAGE_DIR = path.join(ROOT, "assets", "images", "blog");

fs.mkdirSync(BLOG_IMAGE_DIR, { recursive: true });

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, BLOG_IMAGE_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "") || ".png";
    const base = path.basename(file.originalname || "image", ext)
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "") || "image";
    cb(null, `${Date.now()}-${base}${ext}`);
  }
});
const upload = multer({ storage });

function checkAuth(req, res, next) {
  const pass = req.headers["x-admin-pass"];
  if (pass !== CMS_PASSWORD) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

function loadBlogs() {
  if (!fs.existsSync(BLOGS_JS)) return [];
  const script = fs.readFileSync(BLOGS_JS, "utf8");
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(script, sandbox);
  return Array.isArray(sandbox.window.BLOGS_DATA) ? sandbox.window.BLOGS_DATA : [];
}

function saveBlogs(blogs) {
  const clean = Array.isArray(blogs) ? blogs : [];
  fs.writeFileSync(BLOGS_JSON, JSON.stringify(clean, null, 2) + "\n", "utf8");
  fs.writeFileSync(BLOGS_JS, `window.BLOGS_DATA = ${JSON.stringify(clean, null, 2)};\n`, "utf8");
}

app.post("/api/login", (req, res) => {
  if ((req.body?.password || "") === CMS_PASSWORD) {
    return res.json({ ok: true });
  }
  return res.status(401).json({ ok: false, message: "密码错误" });
});

app.get("/api/blogs", checkAuth, (_req, res) => {
  res.json(loadBlogs());
});

app.post("/api/blogs", checkAuth, (req, res) => {
  const blogs = loadBlogs();
  const post = req.body || {};

  if (!post.id || !post.title) {
    return res.status(400).json({ message: "id 和 title 必填" });
  }

  if (blogs.some((x) => x.id === post.id)) {
    return res.status(409).json({ message: "id 已存在" });
  }

  blogs.unshift(post);
  saveBlogs(blogs);
  res.json({ ok: true, data: post });
});

app.put("/api/blogs/:id", checkAuth, (req, res) => {
  const id = req.params.id;
  const blogs = loadBlogs();
  const idx = blogs.findIndex((x) => x.id === id);
  if (idx === -1) return res.status(404).json({ message: "文章不存在" });

  const next = { ...blogs[idx], ...req.body, id };
  blogs[idx] = next;
  saveBlogs(blogs);
  res.json({ ok: true, data: next });
});

app.delete("/api/blogs/:id", checkAuth, (req, res) => {
  const id = req.params.id;
  const blogs = loadBlogs();
  const next = blogs.filter((x) => x.id !== id);
  if (next.length === blogs.length) return res.status(404).json({ message: "文章不存在" });
  saveBlogs(next);
  res.json({ ok: true });
});

app.post("/api/upload", checkAuth, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "缺少图片文件" });
  const rel = `../assets/images/blog/${req.file.filename}`;
  res.json({ ok: true, path: rel, filename: req.file.filename });
});

app.use("/admin", express.static(path.join(ROOT, "admin")));
app.use(express.static(ROOT));

app.listen(PORT, () => {
  console.log(`CMS running: http://localhost:${PORT}/admin`);
  console.log(`Default password: ${CMS_PASSWORD}`);
});
