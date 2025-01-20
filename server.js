const express = require('express');
const fs = require('fs');
const bcrypt = require('bcryptjs'); // Pastikan bcrypt sudah diinstal
const app = express();
const port = 3000; // Ganti dengan port yang kamu inginkan

app.use(express.json()); 

app.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  // Hash password
  bcrypt.hash(password, 10, function(err, hash) {
    if (err) {
      console.error('Error hashing password:', err);
      return res.status(500).send('Error registrasi');
    }

    // Baca data dari user.json
    fs.readFile('user.json', 'utf8', (err, data) => {
      if (err) {
        console.error('Error membaca user.json:', err);
        return res.status(500).send('Error registrasi');
      }

      let users = [];
      try {
        users = JSON.parse(data);
      } catch (parseError) {
        console.error('Error parsing user.json:', parseError);
      }

      // Tambahkan user baru
      users.push({ username, email, password: hash });

      // Tulis data ke user.json
      fs.writeFile('user.json', JSON.stringify(users), err => {
        if (err) {
          console.error('Error menulis ke user.json:', err);
          return res.status(500).send('Error registrasi');
        }
        res.send('Registrasi berhasil');
      });
    });
  });
});

// ... (kode untuk route /save_mod)

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});