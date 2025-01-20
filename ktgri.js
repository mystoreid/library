function getCategories() {
  return fetch('kategori.json')
    .then(response => response.json())
    .catch(error => {
      console.error('Error membaca kategori.json:', error);
      return []; // Mengembalikan array kosong jika terjadi error
    });
}