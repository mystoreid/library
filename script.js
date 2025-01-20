// Fungsi untuk mengambil data mod dari IndexedDB
function getMods() {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open('mod_database', 1);

    request.onerror = function (event) {
      reject(event.target.errorCode);
    };

    request.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction(['mods'], 'readonly');
      const objectStore = transaction.objectStore('mods');
      const request = objectStore.getAll();

      request.onsuccess = function (event) {
        resolve(event.target.result);
      };

      request.onerror = function (event) {
        reject(event.target.errorCode);
      };
    };
  });
}

// Fungsi untuk menampilkan mod di halaman
function displayMods(mods) {
  const modList = document.getElementById('mod-list');
  modList.innerHTML = '';

  // Buat tabel HTML
  const table = document.createElement('table');
  table.id = 'mod-table';
  table.innerHTML = `
    <thead>
      <tr>
        <th>Gambar</th>
        <th>Nama</th>
        <th>Rating</th>
        <th>Rilis</th>
        <th>Aksi</th>
      </tr>
    </thead>
    <tbody>
    </tbody>
  `;
  modList.appendChild(table);

  const tbody = table.querySelector('tbody');
  mods.forEach(mod => {
    const row = tbody.insertRow();
    const data = [
      `<img src="${mod.image}" alt="${mod.name}" height="50">`,
      mod.name,
      mod.rating || 'Belum ada rating',
      mod.releaseDate,
      `<a href="mod.html?id=${mod.id}">Lihat Detail</a>`
    ];
    data.forEach(item => {
      const cell = row.insertCell();
      cell.innerHTML = item;
    });
  });

  // Inisialisasi DataTables
  $(document).ready(function () {
    $('#mod-table').DataTable({
      "pagingType": "full_numbers",
      "searching": false,
      "ordering": false,
      "info": false,
      "language": {
        "paginate": {
          "previous": "« Previous",
          "next": "Next »"
        }
      }
    });
  });
}

// Fungsi untuk menampilkan mod terbaru
function displayLatestMods(mods) {
  const latestModsElement = document.getElementById('latest-mods');
  latestModsElement.innerHTML = '';

  mods.sort((a, b) => b.id - a.id);
  const latestMods = mods.slice(0, 6);

  latestMods.forEach(mod => {
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
    latestModsElement.appendChild(modItem);
  });
}

// Fungsi untuk mengambil kategori dari IndexedDB
function getCategories() {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open('mod_database', 1);

    request.onerror = function(event) {
      reject(event.target.errorCode);
    };

    request.onsuccess = function(event) {
      const db = event.target.result;
      const transaction = db.transaction(['categories'], 'readonly');
      const objectStore = transaction.objectStore('categories');
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
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category.name;
    option.textContent = category.name;
    categoryFilter.appendChild(option);
  });
}

// Fungsi untuk mencari dan filtering mod
function searchAndFilterMods() {
  const searchTerm = document.getElementById('search-input').value.toLowerCase();
  const selectedCategory = document.getElementById('category-filter').value;

  getMods()
    .then(mods => {
      const filteredMods = mods.filter(mod => {
        const matchSearch = mod.name.toLowerCase().includes(searchTerm) ||
                           mod.description.toLowerCase().includes(searchTerm) ||
                           mod.category.toLowerCase().includes(searchTerm);
        const matchCategory = selectedCategory === "" || mod.category === selectedCategory;
        return matchSearch && matchCategory;
      });
      displayMods(filteredMods);
    })
    .catch(error => {
      console.error('Error mengambil data mod:', error);
    });
}

// Event listener untuk pencarian dan filter
const searchInput = document.getElementById('search-input');
searchInput.addEventListener('input', searchAndFilterMods);

const categoryFilter = document.getElementById('category-filter');
categoryFilter.addEventListener('change', searchAndFilterMods);

// Panggil fungsi untuk mengambil dan menampilkan mod dan kategori
getMods()
  .then(mods => {
    console.log("Data mod:", mods);
    displayMods(mods);
    displayLatestMods(mods);
  })
  .catch(error => {
    console.error('Error mengambil data mod:', error);
  });

getCategories()
  .then(categories => {
    displayCategories(categories);
  })
  .catch(error => {
    console.error('Error mengambil data kategori:', error);
  });