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

// Fungsi untuk menampilkan mod per kategori
function displayMods(mods, categoryName) {
  // ... (kode sama seperti sebelumnya)
}

// Fungsi untuk menampilkan kategori
function displayCategories(categories) {
  // ... (kode sama seperti sebelumnya)
}

// Fungsi untuk mendapatkan kategori unik dari data mod
function getUniqueCategories(mods) {
  const categories = new Set();
  mods.forEach(mod => {
    categories.add(mod.category);
  });
  return Array.from(categories);
}

// Ambil data mod dan ekstrak kategori unik
getMods()
  .then(mods => {
    const uniqueCategories = getUniqueCategories(mods);
    displayCategories(uniqueCategories);
  })
  .catch(error => {
    console.error('Error mengambil data mod:', error);
    // Tampilkan pesan error ke user
  });