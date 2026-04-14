const yearEl = document.querySelector("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const revealObserver = new IntersectionObserver(
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

const canvas = document.getElementById("starfield");
const ctx = canvas ? canvas.getContext("2d") : null;
let stars = [];
let trailParticles = [];
let parallaxTargets = [];
let pointerX = window.innerWidth / 2;
let pointerY = window.innerHeight / 2;
let parallaxFrame = null;

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
    const depth = el.classList.contains("hero-avatar") || el.matches(".hero-avatar img")
      ? 15
      : el.matches(".hero-text")
      ? 9
      : el.matches(".project")
      ? 8
      : 6;
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

async function loadData() {
  const skillsWrap = document.querySelector("#skills");
  const projectGrid = document.querySelector("#projectGrid");
  const aboutText = document.querySelector("#aboutText");
  const heroRole = document.querySelector("#heroRole");
  const heroName = document.querySelector("#heroName");
  const heroTagline = document.querySelector("#heroTagline");
  const emailLink = document.querySelector("#emailLink");
  const githubLink = document.querySelector("#githubLink");
  const statsWrap = document.querySelector("#stats");

  try {
    const [siteRes, projectRes] = await Promise.all([
      fetch("./data/site.json"),
      fetch("./data/projects.json")
    ]);

    if (!siteRes.ok || !projectRes.ok) {
      throw new Error("Failed to fetch site data");
    }

    const site = await siteRes.json();
    const projects = await projectRes.json();

    document.title = `${site.name} | Portfolio`;

    if (heroName) heroName.textContent = site.name;
    if (heroRole) heroRole.textContent = site.title;
    if (heroTagline) heroTagline.textContent = site.tagline;
    if (aboutText) aboutText.textContent = site.about;

    if (emailLink) {
      emailLink.textContent = site.email;
      emailLink.href = `mailto:${site.email}`;
    }

    if (githubLink) {
      const githubText = String(site.github).replace("https://", "");
      githubLink.textContent = githubText;
      githubLink.href = site.github;
    }

    if (skillsWrap) {
      skillsWrap.innerHTML = "";
      site.skills.forEach((skill) => {
        const chip = document.createElement("span");
        chip.textContent = skill;
        skillsWrap.appendChild(chip);
      });
    }

    if (statsWrap) {
      statsWrap.innerHTML = "";
      site.highlights.forEach((item) => {
        const stat = document.createElement("article");
        stat.className = "stat";
        stat.innerHTML = `<strong>${item.value}</strong><span>${item.label}</span>`;
        statsWrap.appendChild(stat);
      });
    }

    if (projectGrid) {
      projectGrid.innerHTML = "";
      projects.forEach((item) => {
        const card = document.createElement("article");
        card.className = "project";

        const tags = (item.tags || []).map((tag) => `<span>${tag}</span>`).join("");

        card.innerHTML = `
          <h3>${item.title}</h3>
          <p>${item.summary}</p>
          <div class="project-tags">${tags}</div>
          <a href="${item.link}" target="_blank" rel="noreferrer">View Project →</a>
        `;

        projectGrid.appendChild(card);
      });
    }

    registerParallaxTargets();
    renderParallax();
  } catch (error) {
    console.error("Data loading error:", error);
  }
}

resizeCanvas();
createStars(Math.floor(window.innerWidth / 3.2));
drawStars();
setupMouseEffects();
registerParallaxTargets();
loadData();

window.addEventListener("resize", () => {
  resizeCanvas();
  createStars(Math.floor(window.innerWidth / 3.2));
});
