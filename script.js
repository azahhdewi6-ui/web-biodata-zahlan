// State of the active profile
let currentProfile = 'sri';

// Switch profile function
function switchProfile(target) {
  currentProfile = target;

  const tabSri = document.getElementById('tab-sri');
  const tabDewi = document.getElementById('tab-dewi');
  const tabBoth = document.getElementById('tab-both');
  const profileSri = document.getElementById('profile-sri');
  const profileDewi = document.getElementById('profile-dewi');
  const toggleBtnText = document.getElementById('toggleButtonText');

  // Reset tab states
  [tabSri, tabDewi, tabBoth].forEach(tab => {
    if (tab) {
      tab.classList.remove('active-tab');
      tab.classList.add('inactive-tab');
    }
  });

  if (target === 'sri') {
    tabSri.classList.remove('inactive-tab');
    tabSri.classList.add('active-tab');

    profileSri.classList.remove('hidden', 'mb-10');
    profileSri.classList.add('block');

    profileDewi.classList.remove('block');
    profileDewi.classList.add('hidden');

    if (toggleBtnText) toggleBtnText.innerText = 'Ganti ke Profil Dewi';
  } else if (target === 'dewi') {
    tabDewi.classList.remove('inactive-tab');
    tabDewi.classList.add('active-tab');

    profileDewi.classList.remove('hidden');
    profileDewi.classList.add('block');

    profileSri.classList.remove('block', 'mb-10');
    profileSri.classList.add('hidden');

    if (toggleBtnText) toggleBtnText.innerText = 'Ganti ke Profil Sri Wulan';
  } else if (target === 'both') {
    if (tabBoth) {
      tabBoth.classList.remove('inactive-tab');
      tabBoth.classList.add('active-tab');
    }

    // Show both sections
    profileSri.classList.remove('hidden');
    profileSri.classList.add('block', 'mb-10');

    profileDewi.classList.remove('hidden');
    profileDewi.classList.add('block');

    if (toggleBtnText) toggleBtnText.innerText = 'Fokus Profil Sri';
  }

  // Smooth scroll up on mobile if switched
  if (window.innerWidth < 768 && target !== 'both') {
    const cardContainer = document.getElementById(`profile-${target}`);
    if (cardContainer) {
      cardContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

// Toggle between profiles
function toggleProfile() {
  if (currentProfile === 'sri') {
    switchProfile('dewi');
  } else if (currentProfile === 'dewi') {
    switchProfile('both');
  } else {
    switchProfile('sri');
  }
}

// Keyboard arrow key navigation
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    toggleProfile();
  } else if (e.key === 'Escape') {
    closePhotoModal();
  }
});

// Photo Modal Functions
function openPhotoModal(imgSrc, caption) {
  const modal = document.getElementById('photoModal');
  const modalImage = document.getElementById('modalImage');
  const modalCaption = document.getElementById('modalCaption');

  modalImage.src = imgSrc;
  modalCaption.innerText = caption;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  // allow transition to trigger
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);
}

function closePhotoModal() {
  const modal = document.getElementById('photoModal');
  modal.classList.remove('show');
  setTimeout(() => {
    modal.classList.remove('flex');
    modal.classList.add('hidden');
  }, 300);
}

// Copy to Clipboard with Toast
let toastTimer = null;
function copyText(text, label) {
  navigator.clipboard.writeText(text).then(() => {
    const toast = document.getElementById('toastNotification');
    const toastText = document.getElementById('toastText');

    toastText.innerText = `${label} disalin ke papan klip!`;
    toast.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }).catch(() => {
    // Fallback for older browsers
    const dummy = document.createElement('textarea');
    dummy.value = text;
    document.body.appendChild(dummy);
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);

    const toast = document.getElementById('toastNotification');
    const toastText = document.getElementById('toastText');
    toastText.innerText = `${label} berhasil disalin!`;
    toast.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  });
}

// ===================================================
// Floating Aesthetic Particle Canvas
// ===================================================
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 28;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + Math.random() * 50;
    this.radius = Math.random() * 2.8 + 1;
    this.speedY = Math.random() * 0.45 + 0.15;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.45 + 0.2;
    // Blue & Cream colors
    const colors = [
      'rgba(126, 162, 198,', // soft blue
      'rgba(43, 91, 132,',   // aesthetic blue
      'rgba(217, 200, 175,', // cream
      'rgba(244, 236, 224,'  // light cream
    ];
    this.colorBase = colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.y -= this.speedY;
    this.x += this.speedX;

    if (this.y < -10) {
      this.reset();
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `${this.colorBase} ${this.opacity})`;
    ctx.fill();
  }
}

for (let i = 0; i < particleCount; i++) {
  const p = new Particle();
  p.y = Math.random() * canvas.height; // scatter initial heights
  particles.push(p);
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();
  }
  requestAnimationFrame(animateParticles);
}

animateParticles();
