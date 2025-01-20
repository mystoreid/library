// Ambil ID mod dari URL
const urlParams = new URLSearchParams(window.location.search);
const modId = parseInt(urlParams.get('id'));

// Fungsi untuk mengambil data mod dari IndexedDB
function getMod(id) {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open('mod_database', 1);

    request.onsuccess = function(event) {
      const db = event.target.result;
      const transaction = db.transaction(['mods'], 'readonly');
      const objectStore = transaction.objectStore('mods');
      const request = objectStore.get(id);

      request.onsuccess = function(event) {
        const mod = event.target.result;
        if (mod) {
          resolve(mod);
        } else {
          reject('Mod tidak ditemukan');
        }
      };

      request.onerror = function(event) {
        reject(event.target.errorCode);
      };
    };

    request.onerror = function(event) {
      reject(event.target.errorCode);
    };
  });
}

// Fungsi untuk menampilkan detail mod
function displayModDetails(mod) {
  const modDetails = document.getElementById('mod-details');
  modDetails.innerHTML = `
    <h2>${mod.name}</h2>
    <img src="${mod.image}" alt="${mod.name}" height="100">
    <p>Kategori: ${mod.category}</p>
    <p>Author: ${mod.author}</p>
    <p>Versi: ${mod.mcVersion}</p>
    <p>Rilis: ${mod.releaseDate}</p>
    <p>Deskripsi: ${mod.description}</p>
  `;
}

// Ambil data mod dan tampilkan detailnya
getMod(modId)
  .then(mod => {
    displayModDetails(mod);
  })
  .catch(error => {
    console.error('Error mengambil data mod:', error);
    // Tampilkan pesan error ke user
  });

// Fungsi untuk menghapus mod dari IndexedDB
function deleteMod() {
  const request = window.indexedDB.open('mod_database', 1);

  request.onsuccess = function(event) {
    const db = event.target.result;
    const transaction = db.transaction(['mods'], 'readwrite');
    const objectStore = transaction.objectStore('mods');
    const request = objectStore.delete(modId);

    request.onsuccess = function(event) {
      console.log('Mod berhasil dihapus');
      alert('Mod berhasil dihapus!');
      // Redirect ke admin.html setelah menghapus
      window.location.href = 'admin.html'; 
    };

    request.onerror = function(event) {
      console.error('Error menghapus mod:', event.target.errorCode);
      alert('Gagal menghapus mod! Silakan coba lagi.');
    };
  };

  request.onerror = function(event) {
    console.error('Error membuka database:', event.target.errorCode);
    alert('Error membuka database!');
  };
}