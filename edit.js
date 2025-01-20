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

// Fungsi untuk mengupdate data mod di IndexedDB
function updateModInDB(updatedMod) {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open('mod_database', 1);

    request.onsuccess = function(event) {
      const db = event.target.result;
      const transaction = db.transaction(['mods'], 'readwrite');
      const objectStore = transaction.objectStore('mods');
      const request = objectStore.put(updatedMod);

      request.onsuccess = function(event) {
        resolve();
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

// Ambil data mod dan isi form
getMod(modId)
  .then(mod => {
    const form = document.getElementById('edit-mod-form');
    form.innerHTML = `
      <input type="hidden" id="edit-id" value="${mod.id}">
      <label for="edit-name">Nama Mod:</label>
      <input type="text" id="edit-name" value="${mod.name}" required><br><br>
      <label for="edit-image">File Gambar:</label>
      <input type="file" id="edit-image" name="edit-image" accept="image/*"><br><br>
      <label for="edit-category">Kategori:</label>
      <select id="edit-category">
        </select><br><br>
      <label for="edit-author">Author:</label>
      <input type="text" id="edit-author" value="${mod.author}" required><br><br>
      <label for="edit-download">Link Download:</label>
      <input type="text" id="edit-download" value="${mod.download}" required><br><br>
      <label for="edit-mcVersion">Versi Minecraft:</label>
      <input type="text" id="edit-mcVersion" value="${mod.mcVersion}" required><br><br>
      <label for="edit-releaseDate">Tanggal Rilis:</label>
      <input type="date" id="edit-releaseDate" value="${mod.releaseDate}" required><br><br>
      <label for="edit-description">Deskripsi:</label>
      <textarea id="edit-description" required>${mod.description}</textarea><br><br>
      <button type="submit">Simpan Perubahan</button>
    `;

    // Ambil data kategori dari kategori.json
    fetch('kategori.json')
      .then(response => response.json())
      .then(categories => {
        const select = document.getElementById('edit-category');
        categories.forEach(category => {
          const option = document.createElement('option');
          option.value = category.name;
          option.textContent = category.name;
          if (category.name === mod.category) {
            option.selected = true; // Set kategori yang sesuai sebagai selected
          }
          select.appendChild(option);
        });
      })
      .catch(error => {
        console.error('Error mengambil data kategori:', error);
        // Tampilkan pesan error ke user
      });

    // Event listener untuk form submit
    form.onsubmit = function(event) {
      event.preventDefault();

      // Ambil data dari form edit
      const updatedMod = {
        id: parseInt(document.getElementById('edit-id').value),
        name: document.getElementById('edit-name').value,
        category: document.getElementById('edit-category').value,
        author: document.getElementById('edit-author').value,
        download: document.getElementById('edit-download').value,
        mcVersion: document.getElementById('edit-mcVersion').value,
        releaseDate: document.getElementById('edit-releaseDate').value,
        description: document.getElementById('edit-description').value,
      };

      // Jika gambar baru diupload, baca file dan update data gambar
      const imageFile = document.getElementById('edit-image').files[0];
      if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(event) {
          updatedMod.image = event.target.result;
          updateModInDB(updatedMod)
            .then(() => {
              alert('Mod berhasil diupdate!');
              window.location.href = 'admin.html';
            })
            .catch(error => {
              console.error('Error mengupdate mod:', error);
              alert('Error mengupdate mod!');
            });
        };
        reader.readAsDataURL(imageFile);
      } else {
        // Jika tidak ada gambar baru, gunakan gambar lama
        updatedMod.image = mod.image;
        updateModInDB(updatedMod)
          .then(() => {
            alert('Mod berhasil diupdate!');
            window.location.href = 'admin.html';
          })
          .catch(error => {
            console.error('Error mengupdate mod:', error);
            alert('Error mengupdate mod!');
          });
      }
    };
  })
  .catch(error => {
    console.error('Error mengambil data mod:', error);
    // Tampilkan pesan error ke user
  });