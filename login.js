let users = []; // Variabel untuk menyimpan data user

fetch('user.json')
  .then(response => response.json())
  .then(data => {
    users = data;
  })
  .catch(error => {
    console.error('Error membaca user.json:', error);
  });

// Fungsi untuk mengecek login
function checkLogin(username, password) {
  const user = users.find(user => user.username === username);

  if (user) {
    return bcrypt.compare(password, user.password)
      .then(result => {
        if (result) {
          return user; // Login berhasil
        } else {
          throw new Error('Username atau password salah'); // Login gagal
        }
      });
  } else {
    throw new Error('Username atau password salah'); // Login gagal
  }
}

// Event listener untuk form login
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  checkLogin(username, password)
    .then(user => {
      // Simpan data user di sessionStorage
      sessionStorage.setItem('user', JSON.stringify(user));
      // Redirect ke halaman admin
      window.location.href = 'admin.html'; 
    })
    .catch(error => {
      console.error('Error login:', error);
      // Tampilkan pesan error ke user
      alert(error.message); 
    });
});