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
