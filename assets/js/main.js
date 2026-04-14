const { createApp } = Vue;

const canvas = document.getElementById("starfield");
const ctx = canvas ? canvas.getContext("2d") : null;
let stars = [];
let trailParticles = [];
let parallaxTargets = [];
let pointerX = window.innerWidth / 2;
let pointerY = window.innerHeight / 2;
let parallaxFrame = null;
let revealObserver = null;

function initRevealObserver() {
  if (revealObserver) {
    revealObserver.disconnect();
  }

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    { threshold: 0.14 }
  );

  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
}

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createStars(count) {
  if (!canvas) return;
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    z: Math.random() * 0.8 + 0.2,
    size: Math.random() * 1.7 + 0.25,
    speed: Math.random() * 0.5 + 0.12
  }));
}

function drawStars() {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const star of stars) {
    star.y += star.speed * star.z;
    if (star.y > canvas.height) {
      star.y = -4;
      star.x = Math.random() * canvas.width;
    }

    ctx.beginPath();
    const opacity = 0.22 + star.z * 0.72;
    ctx.fillStyle = `rgba(186, 230, 253, ${opacity})`;
    ctx.arc(star.x, star.y, star.size * star.z, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = trailParticles.length - 1; i >= 0; i -= 1) {
    const p = trailParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 0.02;
    p.size *= 0.986;

    if (p.life <= 0 || p.size < 0.35) {
      trailParticles.splice(i, 1);
      continue;
    }

    ctx.beginPath();
    ctx.fillStyle = `rgba(56, 189, 248, ${p.life})`;
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(drawStars);
}

function spawnTrail(x, y) {
  const particleCount = 4;
  for (let i = 0; i < particleCount; i += 1) {
    trailParticles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 0.9,
      vy: (Math.random() - 0.5) * 0.9,
      size: Math.random() * 2.8 + 1.4,
      life: Math.random() * 0.35 + 0.5
    });
  }

  if (trailParticles.length > 260) {
    trailParticles = trailParticles.slice(trailParticles.length - 260);
  }
}

function registerParallaxTargets() {
  parallaxTargets = Array.from(
    document.querySelectorAll(".hero-text, .hero-avatar img, .stat, .card, .project")
  );

  parallaxTargets.forEach((el) => {
    const depth = el.matches(".hero-avatar img") ? 15 : el.matches(".hero-text") ? 9 : el.matches(".project") ? 8 : 6;
    el.dataset.depth = String(depth);
  });
}

function renderParallax() {
  parallaxFrame = null;
  const nx = (pointerX / window.innerWidth - 0.5) * 2;
  const ny = (pointerY / window.innerHeight - 0.5) * 2;

  document.documentElement.style.setProperty("--mx", `${pointerX}px`);
  document.documentElement.style.setProperty("--my", `${pointerY}px`);

  parallaxTargets.forEach((el) => {
    const depth = Number(el.dataset.depth || 6);
    const tx = -nx * depth;
    const ty = -ny * depth;
    el.style.setProperty("--tx", `${tx.toFixed(2)}px`);
    el.style.setProperty("--ty", `${ty.toFixed(2)}px`);
  });
}

function setupMouseEffects() {
  if (window.matchMedia("(pointer: coarse)").matches) return;

  window.addEventListener("mousemove", (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    spawnTrail(pointerX, pointerY);

    if (!parallaxFrame) {
      parallaxFrame = requestAnimationFrame(renderParallax);
    }
  });

  window.addEventListener("mouseleave", () => {
    pointerX = window.innerWidth / 2;
    pointerY = window.innerHeight / 2;
    if (!parallaxFrame) {
      parallaxFrame = requestAnimationFrame(renderParallax);
    }
  });
}

createApp({
  data() {
    return {
      year: new Date().getFullYear(),
      site: {
        name: "简彬 Jianbin",
        title: "Creative Developer / 创意开发者",
        tagline: "Building delightful websites with speed, style and soul.",
        about: "",
        email: "jianbin@example.com",
        github: "https://github.com/yourname",
        skills: [],
        highlights: []
      },
      projects: [],
      blogs: []
    };
  },
  computed: {
    githubText() {
      return String(this.site.github || "").replace("https://", "");
    }
  },
  methods: {
    blogLink(item) {
      if (item && item.link && item.link !== "#") {
        return item.link;
      }
      return `./blog/post.html?id=${encodeURIComponent(item?.id || "")}`;
    },
    async loadData() {
      try {
        if (!window.SITE_DATA || !window.PROJECTS_DATA || !window.BLOGS_DATA) {
          throw new Error("Data globals are missing");
        }

        this.site = window.SITE_DATA;
        this.projects = window.PROJECTS_DATA;
        this.blogs = window.BLOGS_DATA;

        document.title = `${this.site.name} | Portfolio`;

        await this.$nextTick();
        initRevealObserver();
        registerParallaxTargets();
        renderParallax();
      } catch (error) {
        console.error("Data loading error:", error);
      }
    }
  },
  mounted() {
    resizeCanvas();
    createStars(Math.floor(window.innerWidth / 3.2));
    drawStars();
    setupMouseEffects();
    this.loadData();

    window.addEventListener("resize", () => {
      resizeCanvas();
      createStars(Math.floor(window.innerWidth / 3.2));
    });
  }
}).mount("#app");
