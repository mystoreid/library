const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const searchResults = document.getElementById('search-results');
const categoryFilter = document.getElementById('category-filter');
const modList = document.getElementById('mod-list');
const paginationContainer = document.querySelector('.pagination .container');

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

// Fungsi untuk menyimpan data user ke localStorage
function saveUserDataToLocalStorage(userData) {
  localStorage.setItem('userData', JSON.stringify(userData));
}

// Fungsi untuk mengupdate jumlah pengguna
function updateTotalUsers() {
  const userData = getUserDataFromLocalStorage();
  userData.totalUsers++;
  saveUserDataToLocalStorage(userData);
}

// Fungsi untuk mengupdate jumlah pengguna unik (berdasarkan IP)
function updateUniqueIPs() {
  // Simulasikan IP pengguna (ganti dengan cara mendapatkan IP user yang sebenarnya)
  const userIP = Math.floor(Math.random() * 255) + 1 + "." + 
                 Math.floor(Math.random() * 255) + "." + 
                 Math.floor(Math.random() * 255) + "." + 
                 Math.floor(Math.random() * 255);

  const userData = getUserDataFromLocalStorage();
  if (!userData.uniqueIPs.includes(userIP)) {
    userData.uniqueIPs.push(userIP);
    saveUserDataToLocalStorage(userData);
  }
}

// Panggil fungsi untuk mengupdate jumlah pengguna dan IP unik saat halaman dimuat
updateTotalUsers();
updateUniqueIPs();

// Fungsi untuk menampilkan mod dengan pagination
function tampilkanMod(mods, page = 1) {
  const modsPerPage = 6; // Batas mod per halaman
  const totalPages = Math.ceil(mods.length / modsPerPage);

  // Pastikan page berada dalam rentang yang valid
  page = Math.max(1, Math.min(page, totalPages));

  const startIndex = (page - 1) * modsPerPage;
  const endIndex = startIndex + modsPerPage;
  const modsToDisplay = mods.slice(startIndex, endIndex);

  modList.innerHTML = ''; // Bersihkan list mod

  modsToDisplay.forEach(mod => {
    const modElement = document.createElement('div');
    modElement.classList.add('mod');
    modElement.innerHTML = `
      <img src="${mod.gambar}" alt="${mod.nama}">
      <h3>${mod.nama}</h3>
      <p>${mod.deskripsi}</p>
      <a href="${mod.link}" class="button" download>Download</a> 
      <a href="mod-detail.html?id=${mod.id}" class="button">Lihat Detail</a>
    `;
    modList.appendChild(modElement);
  });

  // Buat pagination
  paginationContainer.innerHTML = '';

  if (totalPages > 1) {
    // Tombol "Previous"
    if (page > 1) {
      const prevButton = document.createElement('a');
      prevButton.href = '#';
      prevButton.textContent = '&laquo; Previous';
      prevButton.addEventListener('click', () => {
        tampilkanMod(mods, page - 1);
      });
      paginationContainer.appendChild(prevButton);
    }

    // Nomor halaman
    for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement('a');
      pageButton.href = '#';
      pageButton.textContent = i;
      if (i === page) {
        pageButton.classList.add('active');
      }
      pageButton.addEventListener('click', () => {
        tampilkanMod(mods, i);
      });
      paginationContainer.appendChild(pageButton);
    }

    // Tombol "Next"
    if (page < totalPages) {
      const nextButton = document.createElement('a');
      nextButton.href = '#';
      nextButton.textContent = 'Next &raquo;';
      nextButton.addEventListener('click', () => {
        tampilkanMod(mods, page + 1);
      });
      paginationContainer.appendChild(nextButton);
    }
  }
}

// Fungsi untuk mengambil data kategori dari localStorage
function getKategoriFromLocalStorage() {
  const addons = getAddonsFromLocalStorage();
  return [...new Set(addons.map(addon => addon.kategori))];
}

// Fungsi untuk menampilkan kategori di dropdown dan filter
function tampilkanKategori() {
  const kategoriDropdown = document.getElementById('category-dropdown');
  const categoryFilter = document.getElementById('category-filter');
  const kategori = getKategoriFromLocalStorage();

  kategori.forEach(kategori => {
    // Tambahkan kategori ke dropdown
    const dropdownItem = document.createElement('li');
    dropdownItem.innerHTML = `<a href="#">${kategori}</a>`;
    kategoriDropdown.appendChild(dropdownItem);

    // Tambahkan kategori ke filter
    const filterOption = document.createElement('option');
    filterOption.value = kategori;
    filterOption.text = kategori;
    categoryFilter.add(filterOption);
  });
}

// Event listener untuk filter kategori
categoryFilter.addEventListener('change', () => {
  const selectedCategory = categoryFilter.value;
  const filteredMods = selectedCategory === 'all'
    ? addons
    : addons.filter(mod => mod.kategori === selectedCategory);
  tampilkanMod(filteredMods);
});

// Event listener untuk pencarian
searchButton.addEventListener('click', () => {
  const keyword = searchInput.value.toLowerCase();
  const hasilPencarian = addons.filter(mod => {
    return mod.nama.toLowerCase().includes(keyword) || mod.deskripsi.toLowerCase().includes(keyword);
  });

  searchResults.innerHTML = ''; // Bersihkan hasil pencarian sebelumnya

  if (hasilPencarian.length > 0) {
    hasilPencarian.forEach(mod => {
      // Buat elemen mod untuk hasil pencarian
      const modElement = document.createElement('div');
      modElement.classList.add('mod'); // Tambahkan class 'mod' untuk styling
      modElement.innerHTML = `
        <img src="${mod.gambar}" alt="${mod.nama}">
        <h3>${mod.nama}</h3>
        <p>${mod.deskripsi}</p>
        <a href="${mod.link}" class="button" download>Download</a>
        <p></p>
        <a href="mod-detail.html?id=${mod.id}" class="button">Lihat Detail</a>
      `;
      searchResults.appendChild(modElement);
    });
  } else {
    searchResults.innerHTML = '<p>Tidak ada hasil ditemukan.</p>';
  }
});

// Fungsi untuk menambahkan addon baru (contoh)
function tambahAddon(addonBaru) {
  addons.push(addonBaru);
  saveAddonsToLocalStorage(addons);
  tampilkanMod(addons);
  tampilkanKategori(); // Update kategori setelah menambahkan addon
}

// Contoh penggunaan tambahAddon (jalankan sekali untuk mengisi data awal)


// ... tambahkan data mod lainnya dengan fungsi tambahAddon() ...

// Tampilkan mod dan kategori saat halaman pertama kali dimuat
tampilkanMod(addons);
tampilkanKategori();