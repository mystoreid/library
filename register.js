function registerUser(username, email, password) {
  // Kirim data ke server menggunakan fetch
  return fetch('/register', { // Pastikan URL sesuai dengan route di server
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, email, password })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Gagal mendaftarkan user'); // Tangani error jika server gagal memproses data
    }
    // Registrasi berhasil, redirect ke halaman login
    window.location.href = 'login.html';
    alert('Registrasi berhasil! Silakan login.');
  })
  .catch(error => {
    console.error('Error registrasi:', error);
    alert(error.message); // Tampilkan pesan error ke user
  });
}

// Fungsi untuk validasi email (bisa diganti dengan regex yang lebih kompleks)
function validateEmail(email) {
  // Gunakan regex untuk validasi email yang lebih akurat
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Event listener untuk form registrasi
const registerForm = document.getElementById('register-form');
registerForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Validasi input
  if (username.length < 3) {
    alert('Username minimal 3 karakter!');
    return;
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    alert('Username hanya boleh berisi huruf, angka, underscore, dan hyphen!');
    return;
  }

  if (password.length < 8) {
    alert('Password minimal 8 karakter!');
    return;
  }

  if (!validateEmail(email)) {
    alert('Email tidak valid!');
    return;
  }

  registerUser(username, email, password);
});