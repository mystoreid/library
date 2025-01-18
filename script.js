// Data pengguna disimpan di localStorage
const USERS_KEY = "modbay_users";

// Daftar addons Minecraft Bedrock
const addons = [
  {
    name: "Cool Mod",
    description: "Mod ini menambahkan fitur keren ke Minecraft.",
    image: "https://via.placeholder.com/300x200.png?text=Cool+Mod",
    category: "utility",
    downloadUrl: "https://contoh-url.com/cool-mod.mcaddon"
  },
  {
    name: "Adventure Addon",
    description: "Tambahkan elemen petualangan baru ke dunia Minecraft Anda.",
    image: "https://via.placeholder.com/300x200.png?text=Adventure+Addon",
    category: "adventure",
    downloadUrl: "https://contoh-url.com/adventure-addon.mcaddon"
  },
  {
    name: "Realistic Textures",
    description: "Perbarui dunia Minecraft Anda dengan tekstur realistis.",
    image: "https://via.placeholder.com/300x200.png?text=Realistic+Textures",
    category: "textures",
    downloadUrl: "https://contoh-url.com/realistic-textures.mcaddon"
  }
];

// Fungsi untuk menyimpan data ke localStorage
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Fungsi untuk memuat data pengguna dari localStorage
function loadUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

// Fungsi untuk memuat daftar addons ke halaman
function loadAddons(filteredAddons) {
  const addonsList = document.getElementById("addons-list");
  addonsList.innerHTML = "";

  filteredAddons.forEach((addon) => {
    const addonCard = document.createElement("div");
    addonCard.className = "addon-card";

    addonCard.innerHTML = `
      <img src="${addon.image}" alt="${addon.name}">
      <div class="content">
        <h3>${addon.name}</h3>
        <p>${addon.description}</p>
        <a href="${addon.downloadUrl}" class="btn-download" target="_blank">Download</a>
      </div>
    `;

    addonsList.appendChild(addonCard);
  });
}

// Fungsi untuk pencarian dan filter
function handleSearchAndFilter() {
  const searchValue = document.getElementById("search-box").value.toLowerCase();
  const selectedCategory = document.getElementById("filter-category").value;

  const filteredAddons = addons.filter((addon) => {
    const matchesSearch = addon.name.toLowerCase().includes(searchValue);
    const matchesCategory =
      selectedCategory === "all" || addon.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  loadAddons(filteredAddons);
}

// Fungsi untuk menghandle login
function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const users = loadUsers();

  const user = users.find((user) => user.email === email && user.password === password);

  if (user) {
    document.getElementById("user-email").textContent = email;
    document.getElementById("login-section").style.display = "none";
    document.getElementById("addons-section").style.display = "block";
    loadAddons(addons);
  } else {
    document.getElementById("login-error").textContent = "username atau password salah.";
    document.getElementById("login-error").style.display = "block";
  }
}

// Fungsi untuk menghandle register
function handleRegister(event) {
  event.preventDefault();

  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  const users = loadUsers();

  if (password !== confirmPassword) {
    document.getElementById("register-error").textContent = "Password tidak cocok.";
    document.getElementById("register-error").style.display = "block";
    return;
  }

  if (users.some((user) => user.email === email)) {
    document.getElementById("register-error").textContent = "Email sudah terdaftar.";
    document.getElementById("register-error").style.display = "block";
    return;
  }

  users.push({ email, password });
  saveUsers(users);
  alert("Registrasi berhasil! Silakan login.");
  document.getElementById("show-login").click();
}

// Event listener untuk form
document.getElementById("login-form").addEventListener("submit", handleLogin);
document.getElementById("register-form").addEventListener("submit", handleRegister);

// Tombol untuk mengganti tampilan login/register
document.getElementById("show-register").addEventListener("click", () => {
  document.getElementById("login-section").style.display = "none";
  document.getElementById("register-section").style.display = "block";
});

document.getElementById("show-login").addEventListener("click", () => {
  document.getElementById("register-section").style.display = "none";
  document.getElementById("login-section").style.display = "block";
});

// Event untuk pencarian dan filter
document.getElementById("search-box").addEventListener("input", handleSearchAndFilter);
document.getElementById("filter-category").addEventListener("change", handleSearchAndFilter);

// Logout
document.getElementById("logout").addEventListener("click", () => {
  document.getElementById("addons-section").style.display = "none";
  document.getElementById("login-section").style.display = "block";
});
