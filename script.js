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
const cutePastelColors = [
  'rgba(186, 215, 248,', // soft baby blue
  'rgba(251, 207, 232,', // soft pastel pink
  'rgba(254, 240, 138,', // warm pastel butter yellow
  'rgba(221, 214, 254,', // soft lavender
  'rgba(254, 215, 170,'  // soft pastel peach
];

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
    this.colorBase = cutePastelColors[Math.floor(Math.random() * cutePastelColors.length)];
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
// Cute Vinyl Music Player Logic
// ===================================================
const bgAudio = document.getElementById('bgAudio');
const playPauseBtn = document.getElementById('playPauseBtn');
const playIcon = document.getElementById('playIcon');
const headerPlayIcon = document.getElementById('headerPlayIcon');
const headerPlayText = document.getElementById('headerPlayText');
const miniStatusIcon = document.getElementById('miniStatusIcon');
const vinylDisc = document.getElementById('vinylDisc');
const vinylDiscMini = document.getElementById('vinylDiscMini');
const musicEqualizer = document.getElementById('musicEqualizer');
const musicProgressBar = document.getElementById('musicProgressBar');
const musicCurrentTime = document.getElementById('musicCurrentTime');
const musicDuration = document.getElementById('musicDuration');
const volumeSlider = document.getElementById('volumeSlider');
const muteIcon = document.getElementById('muteIcon');
const musicSongTitle = document.getElementById('musicSongTitle');
const musicArtist = document.getElementById('musicArtist');

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
    if (miniStatusIcon) {
      miniStatusIcon.classList.remove('fa-music');
      miniStatusIcon.classList.add('fa-pause');
    }

    if (vinylDisc) {
      vinylDisc.classList.add('spinning');
      vinylDisc.classList.remove('paused');
    }
    if (vinylDiscMini) {
      vinylDiscMini.classList.add('spinning');
      vinylDiscMini.classList.remove('paused');
    }
    if (musicEqualizer) {
      musicEqualizer.classList.remove('opacity-30');
      musicEqualizer.classList.add('playing');
    }

    const hint = document.getElementById('musicHint');
    if (hint) hint.remove();
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
    if (miniStatusIcon) {
      miniStatusIcon.classList.remove('fa-pause');
      miniStatusIcon.classList.add('fa-music');
    }

    if (vinylDisc) vinylDisc.classList.add('paused');
    if (vinylDiscMini) vinylDiscMini.classList.add('paused');
    if (musicEqualizer) {
      musicEqualizer.classList.add('opacity-30');
      musicEqualizer.classList.remove('playing');
    }
  }
}

function toggleMusic() {
  if (!bgAudio) return;
  if (bgAudio.paused) {
    bgAudio.play().then(() => {
      updatePlayState(true);
    }).catch(err => {
      console.warn('Autoplay prevented or error:', err);
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
      if (musicCurrentTime) musicCurrentTime.innerText = formatAudioTime(bgAudio.currentTime);
      if (musicDuration) musicDuration.innerText = formatAudioTime(bgAudio.duration);
    }
  });

  bgAudio.addEventListener('loadedmetadata', () => {
    if (musicDuration && !isNaN(bgAudio.duration)) {
      musicDuration.innerText = formatAudioTime(bgAudio.duration);
    }
  });

  bgAudio.addEventListener('ended', () => {
    // If loop is on, it will loop automatically. If not, reset
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

function setVolume(val) {
  if (!bgAudio) return;
  bgAudio.volume = val;
  bgAudio.muted = false;
  if (muteIcon) {
    if (val == 0) {
      muteIcon.className = 'fa-solid fa-volume-xmark text-xs text-rose-500';
    } else if (val < 0.5) {
      muteIcon.className = 'fa-solid fa-volume-low text-xs';
    } else {
      muteIcon.className = 'fa-solid fa-volume-high text-xs';
    }
  }
}

function toggleMute() {
  if (!bgAudio) return;
  bgAudio.muted = !bgAudio.muted;
  if (muteIcon) {
    if (bgAudio.muted) {
      muteIcon.className = 'fa-solid fa-volume-xmark text-xs text-rose-500';
    } else {
      setVolume(volumeSlider ? volumeSlider.value : 0.75);
    }
  }
}

function toggleMusicMinimize() {
  const expanded = document.getElementById('musicWidgetExpanded');
  const minimized = document.getElementById('musicWidgetMinimized');
  if (!expanded || !minimized) return;

  if (expanded.classList.contains('hidden')) {
    expanded.classList.remove('hidden');
    minimized.classList.add('hidden');
  } else {
    expanded.classList.add('hidden');
    minimized.classList.remove('hidden');
  }
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
    if (musicArtist) musicArtist.innerText = 'Lagu Pilihan Pribadi 🎧';

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
