let mods = [];

// Fungsi untuk mengambil data mod dari IndexedDB
function getMods() {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open('mod_database', 1);

    request.onerror = function(event) {
      reject(event.target.errorCode);
    };

    request.onsuccess = function(event) {
      const db = event.target.result;
      const transaction = db.transaction(['mods'], 'readonly');
      const objectStore = transaction.objectStore('mods');
      const request = objectStore.getAll();

      request.onsuccess = function(event) {
        resolve(event.target.result);
      };

      request.onerror = function(event) {
        reject(event.target.errorCode);
      };
    };
  });
}

// Fungsi untuk menampilkan kategori di filter
function displayCategories(categories) {
  const categoryFilter = document.getElementById('category-filter');

  // Tambahkan opsi "Semua Kategori"
  const allCategoriesOption = document.createElement('option');
  allCategoriesOption.value = '';
  allCategoriesOption.textContent = 'Semua Kategori';
  categoryFilter.appendChild(allCategoriesOption);

  const uniqueCategories = new Set(categories); // Gunakan Set untuk mendapatkan kategori unik

  uniqueCategories.forEach(categoryName => {
    const option = document.createElement('option');
    option.value = categoryName;
    option.textContent = categoryName;
    categoryFilter.appendChild(option);
  });
}

// Fungsi untuk menampilkan hasil pencarian
function displaySearchResults(results) {
  const searchResults = document.getElementById('search-results');
  searchResults.innerHTML = '';

  if (results.length === 0) {
    searchResults.innerHTML = "<p>Tidak ada hasil ditemukan.</p>";
    return;
  }

  results.forEach(mod => {
    const modItem = document.createElement('div');
    modItem.className = 'mod-card';
    modItem.innerHTML = `
      <img src="${mod.image}" alt="${mod.name}">
      <div class="mod-info">
        <h3>${mod.name}</h3>
        <p class="view-count">${mod.views || 0} views</p>
        <p class="upload-time">${mod.uploadTime || 'Baru saja'}</p>
        <p class="author">Author: ${mod.author}</p>
        <p class="version">Available for: ${mod.mcVersion}</p>
        <a href="mod.html?id=${mod.id}" class="lihat-detail">Lihat Detail</a>
      </div>
    `;
    searchResults.appendChild(modItem);
  });
}

// Fungsi untuk mencari dan filtering mod
function searchAndFilterMods(event) {
  event.preventDefault(); // Mencegah form submit default

  const searchTerm = document.getElementById('search-input').value.toLowerCase();
  const selectedCategory = document.getElementById('category-filter').value;

  getMods()
    .then(mods => {
      // 1. Gunakan includes() dengan case-insensitive
      const filteredMods = mods.filter(mod => {
        const matchSearch = mod.name.toLowerCase().includes(searchTerm) ||
                           mod.description.toLowerCase().includes(searchTerm) ||
                           mod.category.toLowerCase().includes(searchTerm);
        const matchCategory = selectedCategory === "" || mod.category === selectedCategory;
        return matchSearch && matchCategory;
      });

      // 2. Gunakan Regular Expression (pencarian lebih fleksibel)
      // const regex = new RegExp(searchTerm, 'i');
      // const filteredMods = mods.filter(mod => {
      //   const matchSearch = regex.test(mod.name) || regex.test(mod.description) || regex.test(mod.category);
      //   const matchCategory = selectedCategory === "" || mod.category === selectedCategory;
      //   return matchSearch && matchCategory;
      // });

      displaySearchResults(filteredMods);
    })
    .catch(error => {
      console.error('Error mengambil data mod:', error);
    });
}

// Event listener untuk form submit
const searchForm = document.getElementById('search-form');
searchForm.addEventListener('submit', searchAndFilterMods); 

// Panggil getMods() saat halaman dimuat
getMods()
  .then(modsData => {
    mods = modsData;

    // Ambil kategori dari setiap mod
    const categories = mods.map(mod => mod.category);
    displayCategories(categories);

    searchAndFilterMods({ preventDefault: () => {} }); // Tampilkan semua mod saat halaman dimuat
  })
  .catch(error => {
    console.error('Error mengambil data mod:', error);
  });