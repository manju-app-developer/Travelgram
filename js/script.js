// ======== DARK MODE TOGGLE ===========
const darkModeToggle = document.getElementById("darkModeToggle");
const body = document.body;

if (localStorage.getItem("darkMode") === "enabled") {
    body.classList.add("dark");
}

// Toggle Dark Mode with Smooth Animation
darkModeToggle?.addEventListener("click", () => {
    body.classList.toggle("dark");
    localStorage.setItem("darkMode", body.classList.contains("dark") ? "enabled" : "disabled");
    document.documentElement.style.transition = "background 0.3s ease, color 0.3s ease";
});

// ======== MOBILE NAVBAR TOGGLE ===========
const menuToggle = document.getElementById("menuToggle");
const menu = document.getElementById("menu");

menuToggle?.addEventListener("click", () => {
    menu.classList.toggle("open");
});

// ======== LOADING SCREEN ===========
window.addEventListener("load", () => {
    document.getElementById("loadingScreen")?.classList.add("hidden");
});

// ======== SCROLL TO TOP BUTTON ===========
const scrollTopBtn = document.getElementById("scrollTop");

window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        scrollTopBtn?.classList.remove("hidden");
        scrollTopBtn?.style.opacity = "1";
    } else {
        scrollTopBtn?.style.opacity = "0";
        setTimeout(() => scrollTopBtn?.classList.add("hidden"), 300);
    }
});

scrollTopBtn?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// ======== IMAGE SLIDESHOW ===========
const slides = document.querySelectorAll(".slide");
let currentSlide = 0;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === index);
    });
}

setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}, 3000); // Auto-slide every 3 seconds

// ======== LIKE BUTTON (INSTAGRAM STYLE) ===========
document.querySelectorAll(".like-btn").forEach(button => {
    button.addEventListener("click", () => {
        button.classList.toggle("liked");

        // Animated Heart Effect ❤️
        button.innerHTML = button.classList.contains("liked") 
            ? '<span class="heart-animation">❤️</span> Liked' 
            : '🤍 Like';
    });
});

// ======== BOOKMARK BUTTON ===========
document.querySelectorAll(".bookmark-btn").forEach(button => {
    button.addEventListener("click", () => {
        button.classList.toggle("bookmarked");
        button.textContent = button.classList.contains("bookmarked") ? "✅ Saved" : "🔖 Save";
    });
});

// ======== LOGIN FUNCTION ===========
const loginForm = document.getElementById("loginForm");
const profileSection = document.getElementById("profileSection");
const usernameDisplay = document.getElementById("usernameDisplay");
const logoutBtn = document.getElementById("logoutBtn");

loginForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username && password) {
        localStorage.setItem("user", JSON.stringify({ username }));
        updateProfileUI();
        alert("Login Successful!");
    } else {
        alert("Please enter valid credentials!");
    }
});

// ======== UPDATE PROFILE AFTER LOGIN ===========
function updateProfileUI() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
        profileSection.classList.remove("hidden");
        usernameDisplay.textContent = user.username;
        loginForm.classList.add("hidden");
    }
}

// ======== LOGOUT FUNCTION ===========
logoutBtn?.addEventListener("click", () => {
    localStorage.removeItem("user");
    profileSection.classList.add("hidden");
    loginForm.classList.remove("hidden");
});

// Auto-update profile UI if user is already logged in
updateProfileUI();

// ======== INSTAGRAM-STYLE UPLOAD WITH PREVIEW ===========
const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const preview = document.getElementById("preview");
const statusMessage = document.getElementById("statusMessage");

// ====== PREVIEW IMAGE BEFORE UPLOAD =======
fileInput?.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
            preview.classList.remove("hidden");
        };
        reader.readAsDataURL(file);
    } else {
        alert("Only image files are allowed!");
    }
});

// ====== SIMULATED UPLOAD (Like Instagram) =======
uploadBtn?.addEventListener("click", () => {
    if (!fileInput.files[0]) {
        alert("Please select an image!");
        return;
    }

    statusMessage.textContent = "Uploading...";
    setTimeout(() => {
        statusMessage.textContent = "Upload Successful!";
        preview.classList.add("uploaded");
        fileInput.value = ""; // Reset input
    }, 2000); // Simulated Upload Delay
});

// ======== SMOOTH SCROLLING ===========
document.querySelectorAll("a[href^='#']").forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute("href")).scrollIntoView({ behavior: "smooth" });
    });
});
