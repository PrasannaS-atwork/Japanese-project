/* Season-aware particle layer: sakura petals, fireflies, maple leaves, snow. */
(function () {
  const canvas = document.getElementById("particles");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const LOOK = {
    spring: { colors: ["#ffb7cf", "#ffd6e4", "#fff0f5", "#ff9dbb"], shape: "petal", count: 42, speed: 0.55, sway: 1.5 },
    summer: { colors: ["#fff3a8", "#d6f5a8", "#bdf0d8"], shape: "glow", count: 30, speed: 0.22, sway: 2.2 },
    autumn: { colors: ["#e0582f", "#f0894f", "#c9a227", "#b8551f"], shape: "leaf", count: 34, speed: 0.7, sway: 1.9 },
    winter: { colors: ["#ffffff", "#e6f1fb", "#cfe0ef"], shape: "snow", count: 70, speed: 0.45, sway: 1.1 }
  };

  let season = document.documentElement.dataset.season || "spring";
  let parts = [];
  let w = 0, h = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.width = Math.floor(innerWidth * dpr);
    h = canvas.height = Math.floor(innerHeight * dpr);
    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function make(initial) {
    const cfg = LOOK[season];
    const vw = innerWidth, vh = innerHeight;
    return {
      x: Math.random() * vw,
      y: initial ? Math.random() * vh : -20 - Math.random() * 80,
      r: cfg.shape === "snow" ? 1.4 + Math.random() * 2.6 : 4 + Math.random() * 6,
      vy: cfg.speed * (0.6 + Math.random() * 1.1),
      drift: (Math.random() - 0.5) * cfg.sway,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.05,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.5 + Math.random() * 0.5,
      color: cfg.colors[(Math.random() * cfg.colors.length) | 0]
    };
  }

  function seed() {
    const n = reduce ? 0 : LOOK[season].count * (innerWidth < 680 ? 0.55 : 1);
    parts = Array.from({ length: Math.round(n) }, () => make(true));
  }

  function drawOne(p, shape, t) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;

    if (shape === "petal") {
      ctx.beginPath();
      ctx.ellipse(0, 0, p.r, p.r * 0.62, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = p.alpha * 0.5;
      ctx.beginPath();
      ctx.ellipse(-p.r * 0.3, 0, p.r * 0.5, p.r * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (shape === "leaf") {
      ctx.beginPath();
      ctx.moveTo(0, -p.r);
      ctx.quadraticCurveTo(p.r * 0.9, 0, 0, p.r);
      ctx.quadraticCurveTo(-p.r * 0.9, 0, 0, -p.r);
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,.18)";
      ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.moveTo(0, -p.r); ctx.lineTo(0, p.r); ctx.stroke();
    } else if (shape === "snow") {
      ctx.beginPath();
      ctx.arc(0, 0, p.r, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const pulse = 0.45 + 0.55 * Math.abs(Math.sin(t * 0.0016 + p.phase));
      ctx.globalAlpha = p.alpha * pulse;
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, p.r * 2.4);
      g.addColorStop(0, p.color);
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, p.r * 2.4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function frame(t) {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    const cfg = LOOK[season];
    const vh = innerHeight, vw = innerWidth;
    for (const p of parts) {
      if (cfg.shape === "glow") {
        p.x += Math.sin(t * 0.0006 + p.phase) * cfg.sway * 0.5;
        p.y += Math.cos(t * 0.0005 + p.phase) * 0.4 - 0.08;
      } else {
        p.y += p.vy;
        p.x += p.drift + Math.sin(t * 0.0012 + p.phase) * cfg.sway * 0.5;
        p.rot += p.vr;
      }
      if (p.y > vh + 30 || p.x < -60 || p.x > vw + 60) Object.assign(p, make(false));
      drawOne(p, cfg.shape, t);
    }
    requestAnimationFrame(frame);
  }

  window.setParticleSeason = function (s) {
    if (!LOOK[s]) return;
    season = s;
    seed();
  };

  resize();
  seed();
  addEventListener("resize", () => { resize(); seed(); }, { passive: true });
  if (!reduce) requestAnimationFrame(frame);
})();
