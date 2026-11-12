// State of the active profile
let currentProfile = 'both';

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
function openPhotoModal(imgSrc, caption, igUrl, igHandle) {
  const modal = document.getElementById('photoModal');
  const modalImage = document.getElementById('modalImage');
  const modalCaption = document.getElementById('modalCaption');
  const modalIgLink = document.getElementById('modalIgLink');
  const modalIgText = document.getElementById('modalIgText');

  modalImage.src = imgSrc;
  modalCaption.innerText = caption;

  if (modalIgLink) {
    if (igUrl) {
      modalIgLink.href = igUrl;
      modalIgLink.classList.remove('hidden');
      if (modalIgText && igHandle) modalIgText.innerText = igHandle;
    } else {
      modalIgLink.classList.add('hidden');
    }
  }

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
// Interactive Biodata Management (LocalStorage & Edit Modal)
// ===================================================
const defaultBios = {
  sri: {
    nama: 'Sri Wulandani',
    panggilan: 'Wulan / Sri',
    ttl: '',
    alamat: '',
    sd: '',
    smp: '',
    smk: '',
    jurusan: 'Rekayasa Perangkat Lunak (RPL)',
    kelas: '',
    citacita: 'Aktor (Actress)',
    moto: '“Tumbuhlah menjadi sesuatu yang kau inginkan.”',
    hobi: 'Journaling'
  },
  dewi: {
    nama: 'Dewi Azah Hapsoh',
    panggilan: 'Azah / Dewi',
    ttl: '',
    alamat: '',
    sd: '',
    smp: '',
    smk: '',
    jurusan: 'Rekayasa Perangkat Lunak (RPL)',
    kelas: '',
    citacita: 'Perawat (Nurse)',
    moto: '“Jadikan kegagalan sebagai pelajaran, bukan alasan untuk berhenti.”',
    hobi: 'Musik & Menyanyi'
  }
};

function getBio(target) {
  try {
    const saved = localStorage.getItem('biodata_' + target);
    if (saved) {
      return { ...defaultBios[target], ...JSON.parse(saved) };
    }
  } catch (e) {}
  return defaultBios[target];
}

function saveBio(target, data) {
  try {
    localStorage.setItem('biodata_' + target, JSON.stringify(data));
  } catch (e) {}
  renderBio(target);
}

function renderBio(target) {
  const data = getBio(target);

  const setEl = (id, val, fallback) => {
    const el = document.getElementById(id);
    if (el) {
      if (val && val.trim() !== '') {
        el.innerText = val;
        el.classList.remove('italic', 'text-slate-500');
        el.classList.add('text-slate-800');
      } else {
        el.innerText = fallback || '[Belum diisi - Klik tombol Edit]';
        el.classList.add('italic', 'text-slate-500');
        el.classList.remove('text-slate-800');
      }
    }
  };

  const displayName = document.getElementById(`${target}-display-name`);
  if (displayName) displayName.innerText = data.nama;

  setEl(`${target}-val-nama`, data.nama, data.nama);
  setEl(`${target}-val-panggilan`, data.panggilan, data.panggilan);
  setEl(`${target}-val-ttl`, data.ttl, '[Belum diisi - Klik tombol Edit]');
  setEl(`${target}-val-alamat`, data.alamat, '[Belum diisi - Klik tombol Edit]');
  setEl(`${target}-val-sd`, data.sd, '[Belum diisi]');
  setEl(`${target}-val-smp`, data.smp, '[Belum diisi]');
  setEl(`${target}-val-smk`, data.smk, '[Belum diisi]');
  setEl(`${target}-val-jurusan`, data.jurusan, 'Rekayasa Perangkat Lunak (RPL)');
  setEl(`${target}-val-kelas`, data.kelas, '[Belum diisi - Klik tombol Edit]');
  setEl(`${target}-val-citacita`, data.citacita, data.citacita);
  setEl(`${target}-val-moto`, data.moto, data.moto);
}

// Open Edit Modal
function openEditModal(target) {
  const modal = document.getElementById('editModal');
  const title = document.getElementById('editModalTitle');
  const editTarget = document.getElementById('edit-target');

  const data = getBio(target);
  editTarget.value = target;
  title.innerText = `Edit Biodata ${target === 'sri' ? 'Sri Wulandani' : 'Dewi Azah'}`;

  document.getElementById('input-nama').value = data.nama || '';
  document.getElementById('input-panggilan').value = data.panggilan || '';
  document.getElementById('input-ttl').value = data.ttl || '';
  document.getElementById('input-alamat').value = data.alamat || '';
  document.getElementById('input-sd').value = data.sd || '';
  document.getElementById('input-smp').value = data.smp || '';
  document.getElementById('input-smk').value = data.smk || '';
  document.getElementById('input-jurusan').value = data.jurusan || '';
  document.getElementById('input-kelas').value = data.kelas || '';
  document.getElementById('input-citacita').value = data.citacita || '';
  document.getElementById('input-moto').value = data.moto || '';

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);
}

function closeEditModal() {
  const modal = document.getElementById('editModal');
  if (!modal) return;
  modal.classList.remove('show');
  setTimeout(() => {
    modal.classList.remove('flex');
    modal.classList.add('hidden');
  }, 300);
}

function saveEditedBio(e) {
  e.preventDefault();
  const target = document.getElementById('edit-target').value;
  const current = getBio(target);

  const updated = {
    ...current,
    nama: document.getElementById('input-nama').value,
    panggilan: document.getElementById('input-panggilan').value,
    ttl: document.getElementById('input-ttl').value,
    alamat: document.getElementById('input-alamat').value,
    sd: document.getElementById('input-sd').value,
    smp: document.getElementById('input-smp').value,
    smk: document.getElementById('input-smk').value,
    jurusan: document.getElementById('input-jurusan').value,
    kelas: document.getElementById('input-kelas').value,
    citacita: document.getElementById('input-citacita').value,
    moto: document.getElementById('input-moto').value
  };

  saveBio(target, updated);
  closeEditModal();
  copyText('', 'Biodata berhasil disimpan');
}

// Copy full formatted 9-item text bio to clipboard
function copyFullBio(target) {
  const b = getBio(target);
  const text = `BIODATA DIRI
1. Nama Lengkap: ${b.nama}
2. Nama Panggilan: ${b.panggilan}
3. Tempat, Tanggal Lahir: ${b.ttl || '-'}
4. Alamat: ${b.alamat || '-'}
5. Pendidikan:
   - SD: ${b.sd || '-'}
   - SMP: ${b.smp || '-'}
   - SMK: ${b.smk || '-'}
6. Jurusan: ${b.jurusan}
7. Kelas: ${b.kelas || '-'}
8. Cita-Cita: ${b.citacita}
9. Moto Hidup: ${b.moto}`;

  copyText(text, `Biodata ${target === 'sri' ? 'Sri Wulandani' : 'Dewi Azah'}`);
}

// Initialize biodata on page load
renderBio('sri');
renderBio('dewi');
switchProfile('both');

// ===================================================
// Floating Cute Background Elements (Stars, Hearts, Flowers, Bubbles)
// ===================================================
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 32;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const cuteTypes = ['star', 'heart', 'flower', 'sparkle', 'bubble'];

// Palet warna partikel untuk setiap tema
const themeParticlePalettes = {
  wave: [
    'rgba(186, 215, 248,',
    'rgba(251, 207, 232,',
    'rgba(254, 240, 138,',
    'rgba(221, 214, 254,',
    'rgba(254, 215, 170,'
  ],
  strawberry: [
    'rgba(251, 113, 133,',
    'rgba(244, 63, 94,',
    'rgba(254, 205, 211,',
    'rgba(253, 164, 175,',
    'rgba(254, 240, 138,'
  ],
  matcha: [
    'rgba(74, 222, 128,',
    'rgba(134, 239, 172,',
    'rgba(187, 247, 208,',
    'rgba(254, 240, 138,',
    'rgba(202, 138, 4,'
  ],
  lavender: [
    'rgba(192, 132, 252,',
    'rgba(216, 180, 254,',
    'rgba(167, 139, 250,',
    'rgba(244, 114, 182,',
    'rgba(186, 230, 253,'
  ],
  peach: [
    'rgba(251, 146, 60,',
    'rgba(245, 158, 11,',
    'rgba(253, 186, 116,',
    'rgba(254, 240, 138,',
    'rgba(244, 63, 94,'
  ],
  midnight: [
    'rgba(56, 189, 248,',
    'rgba(129, 140, 248,',
    'rgba(192, 132, 252,',
    'rgba(254, 240, 138,',
    'rgba(255, 255, 255,'
  ]
};

let currentTheme = 'wave';

class CuteParticle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + Math.random() * 40;
    this.size = Math.random() * 7 + 6; // size 6px to 13px
    this.speedY = Math.random() * 0.45 + 0.2;
    this.wobbleSpeed = Math.random() * 0.02 + 0.01;
    this.wobbleAngle = Math.random() * Math.PI * 2;
    this.wobbleRadius = Math.random() * 0.8 + 0.3;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.015;
    this.opacity = Math.random() * 0.45 + 0.3;
    this.type = cuteTypes[Math.floor(Math.random() * cuteTypes.length)];
    const pal = themeParticlePalettes[currentTheme] || themeParticlePalettes.wave;
    this.colorBase = pal[Math.floor(Math.random() * pal.length)];
  }

  update() {
    this.y -= this.speedY;
    this.wobbleAngle += this.wobbleSpeed;
    this.x += Math.sin(this.wobbleAngle) * this.wobbleRadius;
    this.rotation += this.rotSpeed;

    if (this.y < -30) {
      this.reset();
    }
  }

  draw() {
    ctx.save();
    const color = `${this.colorBase} ${this.opacity})`;

    if (this.type === 'star') {
      // 4-Point Sparkle Star
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.fillStyle = color;
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const a1 = (i * Math.PI) / 2;
        const a2 = a1 + Math.PI / 4;
        ctx.lineTo(Math.cos(a1) * this.size, Math.sin(a1) * this.size);
        ctx.lineTo(Math.cos(a2) * (this.size * 0.32), Math.sin(a2) * (this.size * 0.32));
      }
      ctx.closePath();
      ctx.fill();
    } else if (this.type === 'heart') {
      // Cute Mini Heart
      ctx.translate(this.x, this.y);
      ctx.scale(this.size / 10, this.size / 10);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-5, -5, -8, 2, 0, 8);
      ctx.bezierCurveTo(8, 2, 5, -5, 0, 0);
      ctx.fill();
    } else if (this.type === 'flower') {
      // 5-Petal Daisy Flower
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.fillStyle = color;
      for (let i = 0; i < 5; i++) {
        const a = (i * 2 * Math.PI) / 5;
        ctx.beginPath();
        ctx.arc(Math.cos(a) * (this.size * 0.45), Math.sin(a) * (this.size * 0.45), this.size * 0.32, 0, Math.PI * 2);
        ctx.fill();
      }
      // Yellow Center
      ctx.beginPath();
      ctx.arc(0, 0, this.size * 0.22, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(254, 240, 138, ${this.opacity + 0.2})`;
      ctx.fill();
    } else if (this.type === 'bubble') {
      // Cute Shiny Bubble
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 0.7, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      // Highlight spot
      ctx.beginPath();
      ctx.arc(this.x - this.size * 0.25, this.y - this.size * 0.25, this.size * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity + 0.3})`;
      ctx.fill();
    } else {
      // Little Sparkle / Twinkle Dot
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }

    ctx.restore();
  }
}

for (let i = 0; i < particleCount; i++) {
  const p = new CuteParticle();
  p.y = Math.random() * canvas.height;
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

// ===================================================
// Cute Mini Vinyl Music Player Logic (Compact Capsule)
// ===================================================
const bgAudio = document.getElementById('bgAudio');
const playPauseBtn = document.getElementById('playPauseBtn');
const playIcon = document.getElementById('playIcon');
const headerPlayIcon = document.getElementById('headerPlayIcon');
const headerPlayText = document.getElementById('headerPlayText');
const vinylDisc = document.getElementById('vinylDisc');
const musicEqualizer = document.getElementById('musicEqualizer');
const musicProgressBar = document.getElementById('musicProgressBar');
const musicTimeSmall = document.getElementById('musicTimeSmall');
const musicStatusDot = document.getElementById('musicStatusDot');
const musicSongTitle = document.getElementById('musicSongTitle');

function formatAudioTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function updatePlayState(isPlaying) {
  if (isPlaying) {
    if (playIcon) {
      playIcon.classList.remove('fa-play', 'ml-0.5');
      playIcon.classList.add('fa-pause');
    }
    if (headerPlayIcon) {
      headerPlayIcon.classList.remove('fa-play');
      headerPlayIcon.classList.add('fa-pause');
    }
    if (headerPlayText) headerPlayText.innerText = 'Jeda Lagu ⏸️';

    if (vinylDisc) {
      vinylDisc.classList.add('spinning');
      vinylDisc.classList.remove('paused');
    }
    if (musicEqualizer) {
      musicEqualizer.classList.remove('opacity-30');
      musicEqualizer.classList.add('playing');
    }
    if (musicStatusDot) {
      musicStatusDot.classList.add('status-playing');
      musicStatusDot.classList.remove('bg-slate-300');
    }
  } else {
    if (playIcon) {
      playIcon.classList.remove('fa-pause');
      playIcon.classList.add('fa-play', 'ml-0.5');
    }
    if (headerPlayIcon) {
      headerPlayIcon.classList.remove('fa-pause');
      headerPlayIcon.classList.add('fa-play');
    }
    if (headerPlayText) headerPlayText.innerText = 'Putar Lagu 🎵';

    if (vinylDisc) vinylDisc.classList.add('paused');
    if (musicEqualizer) {
      musicEqualizer.classList.add('opacity-30');
      musicEqualizer.classList.remove('playing');
    }
    if (musicStatusDot) {
      musicStatusDot.classList.remove('status-playing');
      musicStatusDot.classList.add('bg-slate-300');
    }
  }
}

function toggleMusic() {
  if (!bgAudio) return;
  if (bgAudio.paused) {
    bgAudio.play().then(() => {
      updatePlayState(true);
    }).catch(err => {
      console.warn('Playback prevented or error:', err);
      copyText('', 'Klik lagi untuk memutar musik 🎵');
    });
  } else {
    bgAudio.pause();
    updatePlayState(false);
  }
}

if (bgAudio) {
  // Set default volume
  bgAudio.volume = 0.75;

  bgAudio.addEventListener('timeupdate', () => {
    if (!isNaN(bgAudio.duration) && bgAudio.duration > 0) {
      const pct = (bgAudio.currentTime / bgAudio.duration) * 100;
      if (musicProgressBar) musicProgressBar.style.width = `${pct}%`;
      if (musicTimeSmall) {
        musicTimeSmall.innerText = `${formatAudioTime(bgAudio.currentTime)} / ${formatAudioTime(bgAudio.duration)}`;
      }
    }
  });

  bgAudio.addEventListener('loadedmetadata', () => {
    if (musicTimeSmall && !isNaN(bgAudio.duration)) {
      musicTimeSmall.innerText = `0:00 / ${formatAudioTime(bgAudio.duration)}`;
    }
  });

  bgAudio.addEventListener('ended', () => {
    if (!bgAudio.loop) {
      updatePlayState(false);
      if (musicProgressBar) musicProgressBar.style.width = '0%';
    }
  });
}

function seekAudio(e) {
  if (!bgAudio || isNaN(bgAudio.duration)) return;
  const container = document.getElementById('musicProgressContainer');
  if (!container) return;
  const rect = container.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const ratio = Math.max(0, Math.min(1, clickX / rect.width));
  bgAudio.currentTime = ratio * bgAudio.duration;
}

function handleCustomMusic(e) {
  const file = e.target.files && e.target.files[0];
  if (!file || !bgAudio) return;

  try {
    const objectUrl = URL.createObjectURL(file);
    bgAudio.src = objectUrl;
    bgAudio.load();

    const cleanName = file.name.replace(/\.[^/.]+$/, "");
    if (musicSongTitle) musicSongTitle.innerText = cleanName;

    bgAudio.play().then(() => {
      updatePlayState(true);
      copyText('', `Memutar lagu: ${cleanName}`);
    }).catch(err => {
      console.warn('Playback error:', err);
    });
  } catch (err) {
    console.error('Failed to load local audio:', err);
  }
}

// ===================================================
// Multiple Aesthetic Theme Management
// ===================================================
const themeMetadata = {
  wave: { name: 'Wave to Earth', icon: '🌊', badge: 'Wave To Earth Palette' },
  strawberry: { name: 'Strawberry Milk', icon: '🍓', badge: 'Strawberry Milk Palette' },
  matcha: { name: 'Matcha Latte', icon: '🍵', badge: 'Matcha Latte Palette' },
  lavender: { name: 'Lavender Dream', icon: '🫐', badge: 'Lavender Dream Palette' },
  peach: { name: 'Sunset Peach', icon: '🌻', badge: 'Sunset Peach Palette' },
  midnight: { name: 'Midnight Stars', icon: '🌙', badge: 'Midnight Stars Palette' }
};

function applyTheme(themeId) {
  if (!themeMetadata[themeId]) themeId = 'wave';
  currentTheme = themeId;

  // Remove existing theme classes from body
  document.body.classList.remove(
    'theme-wave', 'theme-strawberry', 'theme-matcha',
    'theme-lavender', 'theme-peach', 'theme-midnight'
  );

  // Add new theme class
  document.body.classList.add(`theme-${themeId}`);

  // Update header button label and icon
  const info = themeMetadata[themeId];
  const headerIcon = document.getElementById('headerThemeIcon');
  const headerText = document.getElementById('headerThemeText');
  if (headerIcon) headerIcon.innerText = info.icon;
  if (headerText) headerText.innerText = info.name;

  // Update checkmarks in dropdown
  const themeBtns = document.querySelectorAll('.theme-option-btn');
  themeBtns.forEach(btn => {
    const tid = btn.getAttribute('data-theme-id');
    const check = btn.querySelector('.theme-check-icon');
    if (check) {
      if (tid === themeId) {
        check.classList.remove('hidden');
      } else {
        check.classList.add('hidden');
      }
    }
  });

  // Update particle colors immediately
  if (particles && themeParticlePalettes[themeId]) {
    particles.forEach(p => {
      p.colorBase = themeParticlePalettes[themeId][Math.floor(Math.random() * themeParticlePalettes[themeId].length)];
    });
  }

  // Save to localStorage
  try {
    localStorage.setItem('zahlan_selected_theme', themeId);
  } catch (e) {}

  // Close dropdown if open
  closeThemeDropdown();
}

function toggleThemeDropdown(event) {
  if (event) event.stopPropagation();
  const dropdown = document.getElementById('themeDropdownMenu');
  if (dropdown) {
    dropdown.classList.toggle('hidden');
  }
}

function closeThemeDropdown() {
  const dropdown = document.getElementById('themeDropdownMenu');
  if (dropdown) dropdown.classList.add('hidden');
}

// Close dropdown when clicking outside
window.addEventListener('click', (e) => {
  const container = document.getElementById('themeSelectorContainer');
  if (container && !container.contains(e.target)) {
    closeThemeDropdown();
  }
});

// Load saved theme on startup
try {
  const savedTheme = localStorage.getItem('zahlan_selected_theme') || 'wave';
  applyTheme(savedTheme);
} catch (e) {
  applyTheme('wave');
}

// ===================================================
// Interactive Polaroid Memories Gallery Logic
// ===================================================
let polaroidUploadDataUrl = null;

function openAddPolaroidModal(target) {
  const modal = document.getElementById('addPolaroidModal');
  const targetInput = document.getElementById('polaroid-target-input');
  const title = document.getElementById('addPolaroidTitle');
  const form = document.getElementById('addPolaroidForm');
  const previewBox = document.getElementById('polaroidPreviewBox');
  const previewImg = document.getElementById('polaroidPreviewImg');

  if (targetInput) targetInput.value = target;
  if (title) title.innerText = `Tambah Polaroid ${target === 'sri' ? 'Sri Wulandani' : 'Dewi Azah'}`;
  if (form) form.reset();
  if (previewBox) previewBox.classList.add('hidden');
  if (previewImg) previewImg.src = '';
  polaroidUploadDataUrl = null;

  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => modal.classList.add('show'), 10);
  }
}

function closeAddPolaroidModal() {
  const modal = document.getElementById('addPolaroidModal');
  if (modal) {
    modal.classList.remove('show');
    setTimeout(() => {
      modal.classList.remove('flex');
      modal.classList.add('hidden');
    }, 300);
  }
}

function previewPolaroidUpload(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    const img = new Image();
    img.onload = function() {
      const maxDim = 700;
      let width = img.width;
      let height = img.height;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      const cvs = document.createElement('canvas');
      cvs.width = width;
      cvs.height = height;
      const c = cvs.getContext('2d');
      c.drawImage(img, 0, 0, width, height);
      polaroidUploadDataUrl = cvs.toDataURL('image/jpeg', 0.85);

      const previewBox = document.getElementById('polaroidPreviewBox');
      const previewImg = document.getElementById('polaroidPreviewImg');
      if (previewBox && previewImg) {
        previewImg.src = polaroidUploadDataUrl;
        previewBox.classList.remove('hidden');
      }
    };
    img.src = evt.target.result;
  };
  reader.readAsDataURL(file);
}

function saveCustomPolaroid(e) {
  e.preventDefault();
  const target = document.getElementById('polaroid-target-input').value;
  const caption = document.getElementById('inputPolaroidCaption').value.trim();
  const sub = document.getElementById('inputPolaroidSub').value.trim() || 'Momen Estetik 🌸';

  if (!polaroidUploadDataUrl) {
    alert('Silakan pilih foto terlebih dahulu ya!');
    return;
  }

  const newPolaroid = {
    id: Date.now(),
    src: polaroidUploadDataUrl,
    caption: caption,
    sub: sub
  };

  try {
    const key = 'zahlan_custom_polaroids_' + target;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push(newPolaroid);
    localStorage.setItem(key, JSON.stringify(existing));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }

  renderCustomPolaroids(target);
  closeAddPolaroidModal();
  copyText('', 'Foto Polaroid berhasil ditambahkan! 📸');
}

function deleteCustomPolaroid(target, id, e) {
  if (e) e.stopPropagation();
  if (!confirm('Hapus foto polaroid ini?')) return;

  try {
    const key = 'zahlan_custom_polaroids_' + target;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    const filtered = existing.filter(p => p.id !== id);
    localStorage.setItem(key, JSON.stringify(filtered));
  } catch (err) {}

  renderCustomPolaroids(target);
  copyText('', 'Foto polaroid telah dihapus');
}

function renderCustomPolaroids(target) {
  const container = document.getElementById(`custom-polaroids-${target}`);
  if (!container) return;

  let polaroids = [];
  try {
    const key = 'zahlan_custom_polaroids_' + target;
    polaroids = JSON.parse(localStorage.getItem(key) || '[]');
  } catch (e) {}

  const igUrl = target === 'sri' ? 'https://instagram.com/sriwlandnii' : 'https://instagram.com/azahh-ajaa';
  const igHandle = target === 'sri' ? '@sriwlandnii' : '@azahh-ajaa';
  const washiColor = target === 'sri' ? 'washi-tape-blue' : 'washi-tape-pink';
  const borderColor = target === 'sri' ? 'border-sky-100' : 'border-pink-100';
  const textHeading = target === 'sri' ? 'text-sky-950' : 'text-pink-950';

  let html = '';
  polaroids.forEach((item, index) => {
    const rot = index % 2 === 0 ? 'rotate-1' : '-rotate-1';
    html += `
      <div class="relative group cursor-pointer polaroid-frame p-2.5 pb-3 bg-white rounded-2xl border ${borderColor} transform ${rot} group-hover:rotate-0" onclick="openPhotoModal('${item.src}', '${item.caption.replace(/'/g, "\\'")}', '${igUrl}', '${igHandle}')">
        <div class="absolute -top-2.5 left-1/2 -translate-x-1/2 w-12 h-3.5 ${washiColor} rounded-xs opacity-85 pointer-events-none z-10"></div>
        
        <!-- Delete Button -->
        <button type="button" onclick="deleteCustomPolaroid('${target}', ${item.id}, event)" class="absolute top-2 right-2 z-20 w-6 h-6 rounded-full bg-rose-500/80 hover:bg-rose-600 text-white text-[10px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-xs" title="Hapus Polaroid">
          <i class="fa-solid fa-trash"></i>
        </button>

        <div class="relative overflow-hidden rounded-xl aspect-square bg-slate-100 mb-2">
          <img src="${item.src}" alt="${item.caption}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
          <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span class="text-white text-[10px] font-cute flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-full"><i class="fa-solid fa-expand"></i> Perbesar</span>
          </div>
        </div>
        <div class="text-center px-1">
          <p class="polaroid-caption font-cute font-bold ${textHeading} text-xs truncate">${item.caption}</p>
          <p class="polaroid-sub text-[10px] font-mono text-slate-500 truncate">${item.sub}</p>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// Initial render for custom polaroids
renderCustomPolaroids('sri');
renderCustomPolaroids('dewi');
