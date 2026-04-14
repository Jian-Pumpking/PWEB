window.BLOGS_DATA = [
  {
    id: "fast-landing-pages",
    title: "How I Build Fast Landing Pages",
    date: "2026-04-14",
    summary: "A practical workflow for building high-conversion and high-performance pages. 关于高性能落地页的实战流程。",
    link: "#",
    pinned: true,
    thumb: "../assets/images/blog/cover-01.svg",
    cover: "../assets/images/blog/cover-01.svg",
    gallery: ["../assets/images/blog/cover-01.svg", "../assets/images/blog/cover-02.svg"],
    tags: ["Frontend", "Performance", "Workflow"],
    content: [
      "I start from content hierarchy before touching animation. The first screen should answer what, why, and next action in under five seconds.",
      "在实现层面，我会先保证关键渲染路径简洁：减少阻塞脚本、控制首屏资源体积、保证字体加载策略稳定。",
      "Then I add motion progressively: subtle entrance, deliberate hover, and clear interaction feedback. Motion should support conversion, not distract from it.",
      "最后再做性能回归验证，重点看 Lighthouse、交互延迟和移动端流畅度，确保美观和速度同时在线。"
    ]
  },
  {
    id: "design-to-code-notes",
    title: "Design to Code Notes",
    date: "2026-04-10",
    summary: "How to translate visual ideas into clean, maintainable code systems. 从视觉稿到代码系统的思路记录。",
    link: "#",
    pinned: false,
    thumb: "../assets/images/blog/cover-02.svg",
    cover: "../assets/images/blog/cover-02.svg",
    gallery: ["../assets/images/blog/cover-02.svg"],
    tags: ["Design", "Engineering", "System"],
    content: [
      "A good handoff is not about pixel-perfect screenshots. It is about building reusable tokens: spacing, type scale, color roles, and component states.",
      "我会把视觉设计拆成可复用规则，然后映射为 CSS variables 和组件约束，这样后续改版时成本更低。",
      "When design intent is clear in code, collaboration becomes faster. Designers and developers can iterate without rewriting everything."
    ]
  },
  {
    id: "weekly-dev-log",
    title: "Weekly Dev Log",
    date: "2026-04-08",
    summary: "Short updates on experiments, lessons, and product thoughts each week. 每周开发与思考小结。",
    link: "#",
    pinned: false,
    thumb: "../assets/images/blog/cover-01.svg",
    cover: "../assets/images/blog/cover-01.svg",
    gallery: ["../assets/images/blog/cover-01.svg"],
    tags: ["Log", "Thoughts", "Growth"],
    content: [
      "This week I focused on balancing bold visual style with maintainable structure. Data-driven sections saved lots of future editing effort.",
      "本周也尝试了更轻量的鼠标粒子拖尾方案，把效果放进同一个 canvas，减少额外性能开销。",
      "Next week I plan to add a simple post template workflow so writing and publishing blog updates becomes one-step editing."
    ]
  },
  {
    id: "micro-interaction-checklist",
    title: "Micro Interaction Checklist",
    date: "2026-04-02",
    summary: "A compact checklist to keep UI interactions expressive and consistent. 交互细节核对清单。",
    link: "#",
    pinned: false,
    thumb: "../assets/images/blog/cover-02.svg",
    cover: "../assets/images/blog/cover-02.svg",
    gallery: ["../assets/images/blog/cover-02.svg"],
    tags: ["UI", "Interaction", "Checklist"],
    content: [
      "Micro interactions should communicate status, not just decoration.",
      "在设计微交互时，我会优先考虑反馈时机、视觉层级和可预测性。"
    ]
  },
  {
    id: "content-first-portfolio",
    title: "Content-First Portfolio Structure",
    date: "2026-03-28",
    summary: "How to structure a portfolio site so content keeps scaling cleanly. 让作品站随内容增长仍保持清晰。",
    link: "#",
    pinned: false,
    thumb: "../assets/images/blog/cover-01.svg",
    cover: "../assets/images/blog/cover-01.svg",
    gallery: ["../assets/images/blog/cover-01.svg"],
    tags: ["Portfolio", "Content", "Architecture"],
    content: [
      "Treat your site like a publishing system, not a one-time landing page.",
      "内容优先的结构可以让你后续新增文章、项目时几乎不动模板。"
    ]
  },
  {
    id: "performance-budget-notes",
    title: "Performance Budget Notes",
    date: "2026-03-20",
    summary: "A practical way to define and enforce front-end performance budgets. 前端性能预算的实战方法。",
    link: "#",
    pinned: false,
    thumb: "../assets/images/blog/cover-02.svg",
    cover: "../assets/images/blog/cover-02.svg",
    gallery: ["../assets/images/blog/cover-02.svg"],
    tags: ["Performance", "Web", "Budget"],
    content: [
      "Define budget thresholds early and fail CI when metrics regress.",
      "把性能预算写进团队日常流程，比发布前临时优化更有效。"
    ]
  },
  {
    id: "writing-for-dev-blog",
    title: "Writing for Dev Blog",
    date: "2026-03-12",
    summary: "A simple writing pattern for technical blog posts that are easier to read. 技术博客更易读的写作模板。",
    link: "#",
    pinned: false,
    thumb: "../assets/images/blog/cover-01.svg",
    cover: "../assets/images/blog/cover-01.svg",
    gallery: ["../assets/images/blog/cover-01.svg"],
    tags: ["Writing", "Blog", "Communication"],
    content: [
      "Start with the problem, show constraints, then present the solution path.",
      "把复杂观点拆成短段落和小标题，阅读体验会明显提升。"
    ]
  }
];
