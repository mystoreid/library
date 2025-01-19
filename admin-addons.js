// Fungsi untuk mengambil data dari localStorage
function getAddonsFromLocalStorage() {
  const addonsData = localStorage.getItem('addons');
  return addonsData ? JSON.parse(addonsData) : [];
}

// Fungsi untuk menyimpan data ke localStorage
function saveAddonsToLocalStorage(addons) {
  localStorage.setItem('addons', JSON.stringify(addons));
}

// Data addon (diambil dari localStorage)
let addons = getAddonsFromLocalStorage();

// Data kategori (diambil dari localStorage)
let kategori = getKategoriFromLocalStorage();

// Fungsi untuk mengambil data kategori dari localStorage
function getKategoriFromLocalStorage() {
  const kategoriData = localStorage.getItem('kategori');
  return kategoriData ? JSON.parse(kategoriData) : ['kendaraan', 'senjata', 'karakter'];
}

// Fungsi untuk menyimpan data kategori ke localStorage
function saveKategoriToLocalStorage(kategori) {
  localStorage.setItem('kategori', JSON.stringify(kategori));
}

const addonTableBody = document.querySelector('tbody');
const totalAddonsSpan = document.getElementById('total-addons');
const addCategoryForm = document.getElementById('add-category-form');
const namaKategoriInput = document.getElementById('nama-kategori');
const addAddonForm = document.getElementById('add-addon-form');
const addonIdInput = document.getElementById('addon-id');
const namaInput = document.getElementById('nama');
const kategoriSelect = document.getElementById('kategori');
const authorInput = document.getElementById('author');
const versiInput = document.getElementById('versi');
const gambarInput = document.getElementById('gambar');
const deskripsiInput = document.getElementById('deskripsi');
const linkInput = document.getElementById('link');

// Fungsi untuk menampilkan data addon di tabel
function tampilkanAddons() {
  addonTableBody.innerHTML = '';

  addons.forEach(addon => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${addon.id}</td>
      <td>${addon.nama}</td>
      <td>${addon.kategori}</td>
      <td>${addon.author}</td>
      <td>${addon.versi}</td>
      <td>
        <button class="edit" data-addon-id="${addon.id}">Edit</button>
        <button class="delete" data-addon-id="${addon.id}">Delete</button>
      </td>
    `;
    addonTableBody.appendChild(row);
  });

  totalAddonsSpan.textContent = addons.length;
}

// Fungsi untuk mengupdate pilihan kategori di select
function updateKategoriOptions() {
  kategoriSelect.innerHTML = '';

  kategori.forEach(kategori => {
    const option = document.createElement('option');
    option.value = kategori;
    option.text = kategori;
    kategoriSelect.add(option);
  });
}

// Fungsi untuk menampilkan daftar kategori
function tampilkanKategori() {
  const kategoriList = document.getElementById('category-list');
  kategoriList.innerHTML = '';

  kategori.forEach(kategori => {
    const kategoriElement = document.createElement('div');
    kategoriElement.classList.add('category');
    kategoriElement.innerHTML = `
      <h3>${kategori} <button class="delete-kategori" data-kategori="${kategori}">Delete</button></h3>
    `;
    kategoriList.appendChild(kategoriElement);
  });
}

// Event listener untuk form tambah kategori
addCategoryForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const namaKategori = namaKategoriInput.value;

  if (kategori.includes(namaKategori)) {
    alert('Kategori sudah ada!');
    return;
  }

  kategori.push(namaKategori);
  saveKategoriToLocalStorage(kategori);
  updateKategoriOptions();
  tampilkanKategori();
  addCategoryForm.reset();
});

// Event listener untuk form tambah addon
addAddonForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const file = gambarInput.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = (event) => {
      const addonBaru = {
        id: addonIdInput.value ? addonIdInput.value : Date.now().toString(),
        nama: namaInput.value,
        kategori: kategoriSelect.value,
        author: authorInput.value,
        versi: versiInput.value,
        gambar: event.target.result,
        deskripsi: deskripsiInput.value,
        link: linkInput.value
      };

      if (addonIdInput.value) {
        const index = addons.findIndex(addon => addon.id === addonIdInput.value);
        if (index > -1) {
          addons[index] = addonBaru;
        }
      } else {
        addons.push(addonBaru);
      }

      saveAddonsToLocalStorage(addons);
      tampilkanAddons();
      addAddonForm.reset();
      addonIdInput.value = '';
    }

    reader.readAsDataURL(file);
  } else {
    alert("Pilih gambar terlebih dahulu!");
  }
});

// Event listener untuk tombol edit dan delete addon
addonTableBody.addEventListener('click', (event) => {
  if (event.target.classList.contains('edit')) {
    const addonId = event.target.dataset.addonId;
    const addon = addons.find(a => a.id === addonId);
    if (addon) {
      addonIdInput.value = addon.id;
      namaInput.value = addon.nama;
      kategoriSelect.value = addon.kategori;
      authorInput.value = addon.author;
      versiInput.value = addon.versi;
      deskripsiInput.value = addon.deskripsi;
      linkInput.value = addon.link;
    }
  } else if (event.target.classList.contains('delete')) {
    const addonId = event.target.dataset.addonId;
    const index = addons.findIndex(addon => addon.id === addonId);
    if (index > -1) {
      const kategoriAddon = addons[index].kategori;
      addons.splice(index, 1);
      saveAddonsToLocalStorage(addons);

      if (!addons.some(addon => addon.kategori === kategoriAddon)) {
        const kategoriIndex = kategori.indexOf(kategoriAddon);
        if (kategoriIndex > -1) {
          kategori.splice(kategoriIndex, 1);
          saveKategoriToLocalStorage(kategori);
          updateKategoriOptions();
        }
      }

      tampilkanAddons();
    }
  }
});

// Event listener untuk tombol delete kategori
const kategoriList = document.getElementById('category-list');
kategoriList.addEventListener('click', (event) => {
  if (event.target.classList.contains('delete-kategori')) {
    const namaKategori = event.target.dataset.kategori;

    if (confirm(`Apakah Anda yakin ingin menghapus kategori "${namaKategori}"?`)) {
      const index = kategori.indexOf(namaKategori);
      if (index > -1) {
        kategori.splice(index, 1);
        saveKategoriToLocalStorage(kategori);
      }

      addons = addons.filter(addon => addon.kategori !== namaKategori);
      saveAddonsToLocalStorage(addons);

      tampilkanAddons();
      updateKategoriOptions();
      tampilkanKategori();
    }
  }
});

// Fungsi untuk mendapatkan data user dari localStorage
function getUserDataFromLocalStorage() {
  let userData = localStorage.getItem('userData');
  if (userData) {
    return JSON.parse(userData);
  } else {
    // Data awal jika belum ada di localStorage
    return {
      totalUsers: 0,
      uniqueIPs: []
    };
  }
}

// Fungsi untuk menampilkan data di dashboard admin
function tampilkanDataDashboard() {
  const userData = getUserDataFromLocalStorage();
  const totalUsersSpan = document.getElementById('total-users');
  const uniqueIPsSpan = document.getElementById('unique-ips');

  totalUsersSpan.textContent = userData.totalUsers;
  uniqueIPsSpan.textContent = userData.uniqueIPs.length;
}

// Panggil fungsi untuk menampilkan data dashboard
tampilkanDataDashboard();

// Panggil fungsi untuk menampilkan data addon, update pilihan kategori, dan tampilkan daftar kategori
tampilkanAddons();
updateKategoriOptions();
tampilkanKategori();