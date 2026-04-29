/* ===================================================
   Future You 2030 — Interactive Script
   =================================================== */

// ─── Path Data ───
const pathData = {
  student: {
    icon: '🎓',
    title: 'The Visionary Scholar',
    text: 'By 2030, you hold a PhD from a world-renowned university. Your research in AI ethics has been published in top journals and cited over 10,000 times. You lead a cross-continental research lab, mentor the next generation of thinkers, and your TED Talk on "Responsible Intelligence" has 12 million views.',
    stats: [
      { value: '3', label: 'Degrees' },
      { value: '10K+', label: 'Citations' },
      { value: '42', label: 'Countries Visited' },
      { value: '12M', label: 'TED Views' },
    ],
    timeline: [
      { year: '2025', text: 'Graduated top of your class. Received a full scholarship for your Masters.' },
      { year: '2026', text: 'Published your first breakthrough paper on neural-symbolic AI.' },
      { year: '2027', text: 'Started your PhD. Collaborated with researchers across 5 countries.' },
      { year: '2028', text: 'Gave your first keynote at a global AI conference.' },
      { year: '2029', text: 'Founded a research lab focused on ethical AI development.' },
      { year: '2030', text: 'Your work shapes global AI policy. You are a voice for responsible innovation.' },
    ],
  },
  startup: {
    icon: '🚀',
    title: 'The Startup Titan',
    text: 'By 2030, you are the CEO of a fast-growing tech company valued at $500M. You have built products used by millions, raised Series C funding, and been featured on Forbes 30 Under 30. You travel the world, speak at conferences, and inspire a new generation of founders.',
    stats: [
      { value: '$500M', label: 'Valuation' },
      { value: '2.4M', label: 'Users' },
      { value: '180+', label: 'Team Size' },
      { value: 'Forbes', label: '30 Under 30' },
    ],
    timeline: [
      { year: '2025', text: 'Quit your job. Built an MVP in a tiny apartment with 2 co-founders.' },
      { year: '2026', text: 'Launched publicly. Hit 10K users in the first month.' },
      { year: '2027', text: 'Raised $8M Series A. Moved into your first real office.' },
      { year: '2028', text: 'Expanded to 3 countries. Product went viral on social media.' },
      { year: '2029', text: 'Featured on Forbes. Closed a $60M Series B round.' },
      { year: '2030', text: 'Leading a 180-person team. Your product impacts millions of lives daily.' },
    ],
  },
  creator: {
    icon: '🎨',
    title: 'The Digital Storyteller',
    text: 'By 2030, you are a globally recognized content creator with 8M followers across platforms. Your documentary series won a Webby Award, your brand collaborations generate 7-figure revenue, and you have built a creative studio that empowers emerging artists worldwide.',
    stats: [
      { value: '8M', label: 'Followers' },
      { value: 'Webby', label: 'Award Winner' },
      { value: '200+', label: 'Brand Collabs' },
      { value: '50+', label: 'Artists Mentored' },
    ],
    timeline: [
      { year: '2025', text: 'Posted your first video. It flopped — but you kept going.' },
      { year: '2026', text: 'A short film went viral. 500K views overnight.' },
      { year: '2027', text: 'Signed your first major brand deal. Quit your day job.' },
      { year: '2028', text: 'Launched a documentary series on untold stories of creators.' },
      { year: '2029', text: 'Won a Webby Award. Opened a creative studio in your city.' },
      { year: '2030', text: '8M followers. You inspire a global community of digital artists.' },
    ],
  },
};

// ─── DOM References ───
const musicBtn = document.getElementById('musicToggle');
const musicIcon = musicBtn.querySelector('.music-icon');
const resultSection = document.getElementById('result');
const storySection = document.getElementById('story');
const resultIcon = document.getElementById('resultIcon');
const resultTitle = document.getElementById('resultTitle');
const resultText = document.getElementById('resultText');
const resultStats = document.getElementById('resultStats');
const timeline = document.getElementById('timeline');
const pathCards = document.querySelectorAll('.path-card');

// ─── Ambient Music (Web Audio API — no external files needed) ───
let musicPlaying = false;
let audioCtx = null;
let masterGain = null;
let oscillators = [];

function createAmbientMusic() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  masterGain = audioCtx.createGain();
  masterGain.gain.value = 0;
  masterGain.connect(audioCtx.destination);

  // Ambient pad — layered detuned oscillators
  const notes = [130.81, 164.81, 196.00, 246.94]; // C3, E3, G3, B3
  notes.forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.value = freq;
    osc.detune.value = (i - 1.5) * 8; // slight detune for warmth

    filter.type = 'lowpass';
    filter.frequency.value = 400 + i * 100;
    filter.Q.value = 0.5;

    gain.gain.value = 0.12;

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);
    osc.start();
    oscillators.push(osc);
  });

  // Sub bass drone
  const sub = audioCtx.createOscillator();
  const subGain = audioCtx.createGain();
  sub.type = 'sine';
  sub.frequency.value = 65.41; // C2
  subGain.gain.value = 0.08;
  sub.connect(subGain);
  subGain.connect(masterGain);
  sub.start();
  oscillators.push(sub);

  // Slow LFO for gentle movement
  const lfo = audioCtx.createOscillator();
  const lfoGain = audioCtx.createGain();
  lfo.type = 'sine';
  lfo.frequency.value = 0.15; // very slow
  lfoGain.gain.value = 15;
  lfo.connect(lfoGain);
  lfoGain.connect(oscillators[0].frequency);
  lfo.start();
  oscillators.push(lfo);
}

function startMusic() {
  if (!audioCtx) createAmbientMusic();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  // Fade in
  masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
  masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
  masterGain.gain.linearRampToValueAtTime(0.18, audioCtx.currentTime + 1.5);
  musicPlaying = true;
  musicIcon.textContent = '🔊';
  musicBtn.classList.add('playing');
}

function stopMusic() {
  if (!audioCtx || !masterGain) return;
  // Fade out
  masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
  masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
  masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.8);
  musicPlaying = false;
  musicIcon.textContent = '🔇';
  musicBtn.classList.remove('playing');
}

musicBtn.addEventListener('click', () => {
  if (musicPlaying) {
    stopMusic();
  } else {
    startMusic();
  }
});

// Auto-play music on first user interaction
['click', 'touchstart', 'keydown'].forEach((evt) => {
  document.addEventListener(evt, function autoPlay() {
    if (!musicPlaying) startMusic();
    ['click', 'touchstart', 'keydown'].forEach((e) =>
      document.removeEventListener(e, autoPlay)
    );
  }, { once: true });
});

// ─── Smooth Scroll ───
function smoothScroll(selector) {
  const el = document.querySelector(selector);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ─── Path Selection ───
pathCards.forEach((card) => {
  function selectPath() {
    const path = card.dataset.path;
    const data = pathData[path];
    if (!data) return;

    // Mark selected
    pathCards.forEach((c) => c.classList.remove('selected'));
    card.classList.add('selected');

    // Populate result
    resultIcon.textContent = data.icon;
    resultTitle.textContent = data.title;
    resultText.textContent = data.text;

    // Stats
    resultStats.innerHTML = data.stats
      .map(
        (s) =>
          `<div class="stat"><div class="stat-value">${s.value}</div><div class="stat-label">${s.label}</div></div>`
      )
      .join('');

    // Timeline
    timeline.innerHTML = data.timeline
      .map(
        (t) =>
          `<div class="timeline-item reveal"><div class="timeline-year">${t.year}</div><div class="timeline-text">${t.text}</div></div>`
      )
      .join('');

    // Show hidden sections
    resultSection.classList.add('visible');
    storySection.classList.add('visible');

    // Scroll to result
    setTimeout(() => {
      smoothScroll('#result');
      // Re-trigger reveal for new elements
      setTimeout(observeReveals, 200);
    }, 100);
  }

  card.addEventListener('click', selectPath);
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      selectPath();
    }
  });
});

// ─── Scroll Reveal (Intersection Observer) ───
function observeReveals() {
  const reveals = document.querySelectorAll('.reveal:not(.active)');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );
  reveals.forEach((el) => observer.observe(el));
}
observeReveals();

// ─── Particle Background ───
(function initParticles() {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let w, h, particles;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createParticles() {
    const count = Math.min(Math.floor((w * h) / 18000), 80);
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.5 + 0.5,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach((p) => {
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(139, 92, 246, ${p.opacity})`;
      ctx.fill();
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(139, 92, 246, ${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });
})();
