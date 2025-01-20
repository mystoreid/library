document.addEventListener('DOMContentLoaded', function () {
  let db;

  // Buka database
  const request = window.indexedDB.open('mod_database', 1);

  request.onerror = function (event) {
    console.error('Error membuka database:', event.target.errorCode);
  };

  request.onsuccess = function (event) {
    db = event.target.result;
    console.log('Database berhasil dibuka');
    fetchMods();
    fetchCategories();
  };

  request.onupgradeneeded = function (event) {
    db = event.target.result;
    const objectStore = db.createObjectStore('mods', {keyPath: 'id', autoIncrement: true});
    objectStore.createIndex('name', 'name', {unique: false});
    objectStore.createIndex('category', 'category', {unique: false});
    objectStore.createIndex('author', 'author', {unique: false});
    objectStore.createIndex('download', 'download', {unique: false});
    objectStore.createIndex('mcVersion', 'mcVersion', {unique: false});
    objectStore.createIndex('releaseDate', 'releaseDate', {unique: false});

    const userStore = db.createObjectStore('users', {keyPath: 'id', autoIncrement: true});
    userStore.createIndex('username', 'username', {unique: true});

    // Object store untuk kategori
    const categoryStore = db.createObjectStore('categories', {keyPath: 'name'});
  };

  // Fungsi untuk mengambil semua data mod dari IndexedDB
  function fetchMods() {
    const transaction = db.transaction(['mods'], 'readonly');
    const objectStore = transaction.objectStore('mods');
    const request = objectStore.getAll();

    request.onsuccess = function (event) {
      const mods = event.target.result;
      displayMods(mods);
    };

    request.onerror = function (event) {
      console.error('Error mengambil data mod:', event.target.errorCode);
    };
  }

  // Tampilkan mod menggunakan mod-card
  function displayMods(mods) {
    const modList = document.getElementById('admin-mod-list');
    modList.innerHTML = ''; // Kosongkan daftar mod

    mods.forEach(mod => {
      const modItem = document.createElement('div');
      modItem.className = 'mod-card';
      modItem.innerHTML = `
        <img src="${mod.image}" alt="${mod.name}">
        <h3>${mod.name}</h3>
        <p class="category">Kategori: ${mod.category}</p> 
        <p class="rating">Rating: ${mod.rating || 'Belum ada rating'}</p> 
        <p class="author">Author: ${mod.author}</p> 
        <p class="version">Versi: ${mod.mcVersion}</p> 
        <p class="date">Rilis: ${mod.releaseDate}</p> 
        <p>Deskripsi: ${mod.description}</p>
        <a href="${mod.download}" class="button">Download</a> 
        <a href="edit.html?id=${mod.id}" class="button">Edit</a>
        <a href="hapus.html?id=${mod.id}" class="button">Hapus</a>
      `;
      modList.appendChild(modItem);
    });
  }

  // Fungsi untuk menambah mod baru
  function addMod(modData) {
    const transaction = db.transaction(['mods'], 'readwrite');
    const objectStore = transaction.objectStore('mods');
    const request = objectStore.add(modData);

    request.onsuccess = function (event) {
      console.log('Mod berhasil ditambahkan');
      fetchMods(); // Refresh daftar mod setelah menambahkan
      alert('Mod berhasil ditambahkan!');
      form.reset(); // Reset form setelah submit
    };

    request.onerror = function (event) {
      console.error('Error menambahkan mod:', event.target.errorCode);
      alert('Error menambahkan mod!');
    };
  }

  // Event listener untuk form submit
  const form = document.getElementById('add-mod-form');
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const imageFile = document.getElementById('image').files[0];
    const category = document.getElementById('category').value;
    const author = document.getElementById('author').value;
    const download = document.getElementById('download').value;
    const mcVersion = document.getElementById('mcVersion').value;
    const releaseDate = document.getElementById('releaseDate').value;
    const description = document.getElementById('description').value;

    if (!imageFile) {
      alert('Pilih file gambar!');
      return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
      const imageBase64 = event.target.result;

      addMod({
        name: name,
        image: imageBase64,
        category: category,
        author: author,
        download: download,
        mcVersion: mcVersion,
        releaseDate: releaseDate,
        description: description
      });
    };
    reader.readAsDataURL(imageFile);
  });

  // ... (Fungsi editMod() dan deleteMod() - implementasi sama seperti sebelumnya)

  // Perlindungan halaman admin
  

  // --- Manajemen Kategori ---

  // Fungsi untuk mengambil daftar kategori
  function fetchCategories() {
    const transaction = db.transaction(['categories'], 'readonly');
    const objectStore = transaction.objectStore('categories');
    const request = objectStore.getAll();

    request.onsuccess = function(event) {
      const categories = event.target.result;
      updateCategorySelect(categories);
    };

    request.onerror = function(event) {
      console.error("Error mengambil kategori:", event.target.errorCode);
    };
  }

  // Fungsi untuk mengupdate pilihan kategori di dropdown
  function updateCategorySelect(categories, selectToUpdate = null) {
    const selectElements = selectToUpdate ? [selectToUpdate] : 
      [document.getElementById('category-filter')];

    selectElements.forEach(select => {
      select.innerHTML = '';

      const option = document.createElement('option');
      option.value = '';
      option.textContent = 'Pilih kategori';
      select.appendChild(option);

      if (categories) {
        categories.forEach(category => {
          const option = document.createElement('option');
          option.value = category.name;
          option.textContent = category.name;
          select.appendChild(option);
        });
      }
    });
  }
}); // Akhir dari DOMContentLoaded