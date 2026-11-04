// Lightweight playback of the locally rendered Three.js atlas + native particles.
// A single clock drives pose, contact, smoke and sparks; no runtime 3D dependency.
(() => {
  window.createAvanceOpeningScene = (intro) => {
    const canvas = intro.querySelector("canvas");
    const atlas = intro.querySelector("[data-gavel-atlas]");
    if (!canvas || !atlas) return null;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return null;
    const resolution = Math.min(2, window.devicePixelRatio || 1) * Math.min(640, window.innerWidth * .98);
    canvas.width = canvas.height = Math.ceil(resolution);
    const scale = canvas.width / 512;
    // Seeded particles make Replay and frame-by-frame review reproducible.
    let seed = 1998;
    const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    const particles = Array.from({ length: 76 }, (_, i) => {
      const angle = -Math.PI + random() * Math.PI;
      const speed = 140 + random() * 310;
      return { vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 25, life: .4 + random() * .45, r: 1 + random() * 1.25, hot: i % 3 === 0 };
    });
    const puffs = Array.from({ length: 12 }, () => ({ x: (random() - .5) * 130, y: -20 - random() * 85, r: 27 + random() * 38, rotation: random() * Math.PI, delay: random() * .1 }));
    const mist = document.createElement("canvas");
    mist.width = mist.height = 128;
    const mc = mist.getContext("2d");
    const glow = mc.createRadialGradient(64, 64, 0, 64, 64, 64);
    glow.addColorStop(0, "rgba(214,204,181,.72)");
    glow.addColorStop(.35, "rgba(173,164,149,.4)");
    glow.addColorStop(1, "rgba(137,128,115,0)");
    mc.fillStyle = glow;
    mc.fillRect(0, 0, 128, 128);
    mc.globalCompositeOperation = "destination-out";
    for (let i = 0; i < 26; i++) {
      mc.beginPath();
      mc.fillStyle = "rgba(0,0,0,.16)";
      mc.ellipse(random() * 128, random() * 128, 5 + random() * 15, 4 + random() * 10, random() * Math.PI, 0, Math.PI * 2);
      mc.fill();
    }
    const clamp = n => Math.max(0, Math.min(1, n));
    function draw(ms) {
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      ctx.clearRect(0, 0, 512, 512);
      const sinceContact = (ms - 540) / 1000;
      // Keep the rear grip visually fixed; impact comes from the head and particles,
      // rather than shaking the entire image (which would also move the handle).
      // Black below the gavel is an invisible floor, suggested only by contact light.
      if (atlas.complete && atlas.naturalWidth) {
        const frame = Math.min(31, Math.max(0, Math.floor(ms * .03)));
        const cell = atlas.naturalWidth / 8;
        ctx.globalAlpha = clamp(ms / 110) * (1 - clamp((ms - 690) / 270));
        ctx.drawImage(atlas, frame % 8 * cell, Math.floor(frame / 8) * cell, cell, cell, 0, 0, 512, 512);
        ctx.globalAlpha = 1;
      }
      if (sinceContact < 0 || sinceContact > 1.04) return;
      const x = 256.00, y = 379.08, t = sinceContact;
      // One warm impact bloom, rather than repeated flashes.
      const bloom = Math.exp(-t * 10);
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      const impact = ctx.createRadialGradient(x, y, 0, x, y, 65 + t * 100);
      impact.addColorStop(0, `rgba(255,234,183,${.9 * bloom})`);
      impact.addColorStop(.13, `rgba(237,167,61,${.7 * bloom})`);
      impact.addColorStop(.5, `rgba(143,73,23,${.35 * bloom})`);
      impact.addColorStop(1, "rgba(84,43,13,0)");
      ctx.fillStyle = impact;
      ctx.fillRect(x - 180, y - 180, 360, 360);
      ctx.globalAlpha = .65 * Math.exp(-t * 6);
      ctx.strokeStyle = "#c8984c";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(x, y, 12 + t * 220, 2 + t * 30, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
      for (const p of particles) {
        if (t > p.life) continue;
        const px = x + p.vx * t, py = y + p.vy * t + 150 * t * t;
        const tail = .025;
        ctx.globalAlpha = (1 - t / p.life) ** .6;
        ctx.strokeStyle = p.hot ? "#fff1cc" : "#eab25c";
        ctx.lineWidth = p.r;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(px - p.vx * tail, py - (p.vy + 300 * t) * tail);
        ctx.lineTo(px, py);
        ctx.stroke();
        if (p.hot) {
          ctx.fillStyle = "rgba(237,164,64,.12)";
          ctx.beginPath();ctx.arc(px, py, 4.5, 0, Math.PI * 2);ctx.fill();
        }
      }
      ctx.restore();
      // Soft textured smoke rises around the logo instead of tiny invisible dots.
      for (const puff of puffs) {
        const u = t - puff.delay;
        if (u < 0) continue;
        const fade = Math.sin(clamp(u / .9) * Math.PI);
        const radius = puff.r * (.5 + u * 1.6);
        ctx.save();
        ctx.globalAlpha = fade * .6;
        ctx.translate(x + puff.x * u, y + puff.y * u - u * 100);
        ctx.rotate(puff.rotation + u * .25);
        ctx.drawImage(mist, -radius, -radius * .65, radius * 2, radius * 1.3);
        ctx.restore();
      }
    }
    return { draw, dispose() { canvas.width = canvas.height = 1; mist.width = mist.height = 1; } };
  };
})();
