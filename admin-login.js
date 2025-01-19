const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Validasi login (ganti dengan logika autentikasi server Anda)
  if (username === 'admin' && password === 'password') {
    // Login berhasil, alihkan ke admin-addons.html
    window.location.href = 'admin-addons.html';
  } else {
    // Login gagal, tampilkan pesan error
    alert('Username atau password salah!');
  }
});