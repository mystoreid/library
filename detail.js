// Fungsi untuk mengambil data dari localStorage
function getAddonsFromLocalStorage() {
  const addonsData = localStorage.getItem('addons');
  return addonsData ? JSON.parse(addonsData) : [];
}

const urlParams = new URLSearchParams(window.location.search);
const modId = urlParams.get('id');

// Data addon (diambil dari localStorage)
const addons = getAddonsFromLocalStorage();

const mod = addons.find(m => m.id === modId);

if (mod) {
  document.getElementById('mod-nama').textContent = mod.nama;
  document.getElementById('mod-gambar').src = mod.gambar;
  document.getElementById('mod-gambar').alt = mod.nama;
  document.getElementById('mod-deskripsi').textContent = mod.deskripsi;
  document.getElementById('mod-kategori').textContent = mod.kategori;
  document.getElementById('mod-author').textContent = mod.author;
  document.getElementById('mod-versi').textContent = mod.versi;
  document.getElementById('mod-unduh').href = mod.link;
} else {
  console.log('Mod tidak ditemukan');
}