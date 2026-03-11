// Starfield
    const canvas = document.getElementById('starfield');
    const ctx = canvas.getContext('2d');
    let stars = [];
    let W, H;

    function resizeCanvas() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function createStars() {
      stars = [];
      for (let i = 0; i < 350; i++) {
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: Math.random() * 1.5,
          alpha: Math.random(),
          speed: Math.random() * 0.3 + 0.05,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          twinkleDir: Math.random() > 0.5 ? 1 : -1
        });
      }
    }

    function drawStars() {
      ctx.clearRect(0, 0, W, H);
      stars.forEach(s => {
        s.alpha += s.twinkleSpeed * s.twinkleDir;
        if (s.alpha >= 1 || s.alpha <= 0.1) s.twinkleDir *= -1;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,220,255,${s.alpha})`;
        ctx.fill();
      });
      requestAnimationFrame(drawStars);
    }

    resizeCanvas();
    createStars();
    drawStars();
    window.addEventListener('resize', () => { resizeCanvas(); createStars(); });

    // Cursor
    const cursor = document.getElementById('cursor');
    const ring = document.getElementById('cursor-ring');
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top = my + 'px';
    });

    function animateRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // HUD time
    function updateTime() {
      const now = new Date();
      document.getElementById('hud-time').textContent =
        now.toUTCString().split(' ')[4] + ' UTC';
    }
    setInterval(updateTime, 1000);
    updateTime();

    // Scroll effects
    const sections = ['intro', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
    const dots = document.querySelectorAll('.nav-dot');
    const progressBar = document.getElementById('progress-bar');
    const planetCounter = document.getElementById('planet-counter');

    const planetNames = ['INTRO', 'MERCURY', 'VENUS', 'EARTH', 'MARS', 'JUPITER', 'SATURN', 'URANUS', 'NEPTUNE'];

    // Intersection Observer for planet content reveal
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const content = entry.target.querySelector('.planet-content');
          if (content) content.classList.add('visible');

          const sunContent = entry.target.querySelector('.sun-content');
          if (sunContent) {
            sunContent.style.opacity = '1';
            sunContent.style.transform = 'translateY(0)';
          }
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.planet-section, #sun-section').forEach(s => observer.observe(s));

    // Scroll progress & nav
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      progressBar.style.width = progress + '%';

      // Active nav dot
      let activeIdx = 0;
      sections.forEach((id, i) => {
        const el = document.getElementById(id);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.5) activeIdx = i;
      });

      dots.forEach((d, i) => d.classList.toggle('active', i === activeIdx));

      const pIdx = activeIdx;
      if (pIdx >= 1) {
        planetCounter.textContent = `PLANET ${String(pIdx).padStart(2, '0')} / 08`;
      } else {
        planetCounter.textContent = 'SOLAR SYSTEM';
      }

      // Parallax on starfield
      canvas.style.transform = `translateY(${scrollTop * 0.1}px)`;
    });

    // Nav dot clicks
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        const id = dot.getAttribute('data-section');
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      });
    });

    // Planet hover particles
    document.querySelectorAll('.planet-sphere').forEach(sphere => {
      sphere.addEventListener('mouseenter', () => {
        cursor.style.width = '20px';
        cursor.style.height = '20px';
        ring.style.borderColor = 'rgba(255,255,255,0.6)';
        spawnParticles(sphere);
      });
      sphere.addEventListener('mouseleave', () => {
        cursor.style.width = '12px';
        cursor.style.height = '12px';
        ring.style.borderColor = 'rgba(255,255,255,0.4)';
      });
    });

    function spawnParticles(el) {
      const rect = el.getBoundingClientRect();
      for (let i = 0; i < 8; i++) {
        const p = document.createElement('div');
        p.style.cssText = `
      position:fixed;
      width:3px;height:3px;
      border-radius:50%;
      background:rgba(200,220,255,0.8);
      pointer-events:none;
      z-index:9000;
      left:${rect.left + rect.width / 2 + (Math.random() - 0.5) * rect.width}px;
      top:${rect.top + rect.height / 2 + (Math.random() - 0.5) * rect.height}px;
      animation:particleDrift ${Math.random() * 1 + 0.5}s ease-out forwards;
    `;
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 1500);
      }
    }

    // Title glitch effect
    function glitch() {
      const title = document.querySelector('.intro-title');
      if (!title) return;
      title.style.textShadow = `
    ${(Math.random() - 0.5) * 6}px 0 rgba(255,0,100,0.5),
    ${(Math.random() - 0.5) * 6}px 0 rgba(0,255,255,0.5),
    0 0 40px rgba(79,195,247,0.4)
  `;
      setTimeout(() => {
        title.style.textShadow = '0 0 40px rgba(79,195,247,0.4), 0 0 80px rgba(79,195,247,0.2)';
      }, 80);
    }
    setInterval(glitch, 4000);

    // Stat card animation
    document.querySelectorAll('.stat-item').forEach((item, i) => {
      item.style.transitionDelay = `${i * 0.08}s`;
    });

