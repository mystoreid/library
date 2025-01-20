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

// Fungsi untuk mengambil data semua mod dari IndexedDB (digunakan untuk rekomendasi)
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

// Fungsi untuk mengambil rekomendasi mod
function getRecommendations(modId) {
  return new Promise((resolve, reject) => {
    getMod(modId)
      .then(mod => {
        getMods()
          .then(allMods => {
            const recommendations = allMods.filter(m => 
              m.id !== modId && m.category === mod.category
            );
            resolve(recommendations);
          })
          .catch(reject);
      })
      .catch(reject);
  });
}

// Fungsi untuk menampilkan mod yang direkomendasikan
function displayRecommendations(mods) {
  const recommendationsElement = document.getElementById('recommendations');
  recommendationsElement.innerHTML = '';

  if (mods.length === 0) {
    recommendationsElement.textContent = "Tidak ada rekomendasi.";
    return;
  }

  mods.forEach(mod => {
    const modItem = document.createElement('div');
    modItem.className = 'mod-card';
    modItem.innerHTML = `
      <img src="${mod.image}" alt="${mod.name}">
      <h3>${mod.name}</h3>
      <p class="category">Kategori: ${mod.category}</p> 
      <p class="rating">Rating: ${mod.rating || 'Belum ada rating'}</p> 
      <p>${mod.description}</p>
      <a href="mod.html?id=${mod.id}">Lihat Detail</a>
    `;
    recommendationsElement.appendChild(modItem);
  });
}

// Fungsi untuk mengambil komentar dari IndexedDB (implementasi tergantung kebutuhan)
function getComments(modId) {
  // ... (implementasi untuk mengambil data komentar berdasarkan modId)
  // Contoh:
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open('mod_database', 1);
    request.onsuccess = function(event) {
      const db = event.target.result;
      const transaction = db.transaction(['comments'], 'readonly'); // Ganti 'comments' dengan nama object store komentar
      const objectStore = transaction.objectStore('comments');
      const index = objectStore.index('modId'); // Ganti 'modId' dengan nama index untuk modId di object store komentar
      const request = index.getAll(modId);

      request.onsuccess = function(event) {
        resolve(event.target.result);
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

// Fungsi untuk menampilkan komentar
function displayComments(comments) {
  const commentsList = document.getElementById('comments-list');
  commentsList.innerHTML = '';

  if (comments.length === 0) {
    commentsList.textContent = "Belum ada komentar.";
    return;
  }

  comments.forEach(comment => {
    const commentElement = document.createElement('div');
    commentElement.className = 'comment';
    commentElement.innerHTML = `
      <p><strong>${comment.user}</strong>: ${comment.text}</p>
    `;
    commentsList.appendChild(commentElement);
  });
}

// Event listener untuk form submit komentar
const commentForm = document.getElementById('comment-form');
commentForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const commentText = document.getElementById('comment-text').value;

  // Ambil user dari sessionStorage
  const user = JSON.parse(sessionStorage.getItem('user'));
  if (!user) {
    alert('Anda harus login untuk menambahkan komentar!');
    return;
  }

  // Simpan komentar ke IndexedDB (implementasi tergantung kebutuhan)
  // ...
  // Contoh:
  addComment(modId, user.username, commentText)
    .then(() => {
      // Refresh komentar setelah submit
      getComments(modId).then(displayComments);
      commentForm.reset();
    })
    .catch(error => {
      console.error('Error menambahkan komentar:', error);
      alert('Error menambahkan komentar!');
    });
});

// Fungsi untuk menambahkan komentar ke IndexedDB
function addComment(modId, user, commentText) {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open('mod_database', 1);

    request.onsuccess = function(event) {
      const db = event.target.result;
      const transaction = db.transaction(['comments'], 'readwrite'); // Ganti 'comments' dengan nama object store komentar
      const objectStore = transaction.objectStore('comments');
      const request = objectStore.add({ modId: modId, user: user, text: commentText });

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

// Fungsi untuk menyimpan rating dan review
function saveReview(modId, rating, comment) {
  // ... (implementasi untuk menyimpan rating dan review ke IndexedDB)
  // Contoh:
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open('mod_database', 1);

    request.onsuccess = function(event) {
      const db = event.target.result;
      const transaction = db.transaction(['mods'], 'readwrite');
      const objectStore = transaction.objectStore('mods');
      const getRequest = objectStore.get(modId);

      getRequest.onsuccess = function(event) {
        const mod = event.target.result;

        // Update rating (jika belum ada)
        if (!mod.rating) {
          mod.rating = rating;
        } else {
          // Hitung rata-rata rating (jika sudah ada)
          mod.rating = (mod.rating + rating) / 2; 
        }

        // Tambahkan review
        if (!mod.reviews) {
          mod.reviews = [];
        }
        mod.reviews.push({ user: "Anonymous", comment: comment }); // Ganti "Anonymous" dengan username jika ada sistem login

        const updateRequest = objectStore.put(mod);

        updateRequest.onsuccess = function(event) {
          resolve();
        };

        updateRequest.onerror = function(event) {
          reject(event.target.errorCode);
        };
      };

      getRequest.onerror = function(event) {
        reject(event.target.errorCode);
      };
    };

    request.onerror = function(event) {
      reject(event.target.errorCode);
    };
  });
}

// Event listener untuk form submit rating dan review
const reviewForm = document.getElementById('review-form');
reviewForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const rating = parseInt(document.getElementById('rating').value);
  const comment = document.getElementById('comment').value;

  saveReview(modId, rating, comment)
    .then(() => {
      // Refresh halaman setelah review disimpan
      location.reload(); 
    })
    .catch(error => {
      console.error('Error menyimpan review:', error);
      // Tampilkan pesan error ke user
    });
});

// Tampilkan detail mod, rekomendasi, komentar
getMod(modId)
  .then(mod => {
    console.log("Data mod:", mod); // Cek data mod di console
    document.getElementById('mod-name').textContent = mod.name;
    document.getElementById('mod-image').src = mod.image;
    document.getElementById('mod-image').alt = mod.name;
    document.getElementById('mod-description').textContent = mod.description;
    document.getElementById('mod-category').textContent = `Kategori: ${mod.category}`;
    document.getElementById('mod-version').textContent = `Versi: ${mod.mcVersion}`;
    document.getElementById('mod-release-date').textContent = `Rilis: ${mod.releaseDate}`;
    document.getElementById('download-button').href = mod.download; // Set link download

    // Ambil dan tampilkan rekomendasi
    getRecommendations(modId).then(displayRecommendations);

    // Ambil dan tampilkan komentar
    getComments(modId).then(displayComments);
  })
  .catch(error => {
    console.error('Error mengambil data mod:', error); // Log detail error
    // Tampilkan pesan error ke user
    document.getElementById('mod-name').textContent = "Mod tidak ditemukan";
  });