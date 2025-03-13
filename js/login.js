document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const togglePassword = document.querySelector(".toggle-password");
    const rememberMeCheckbox = document.getElementById("rememberMe");
    const loadingScreen = document.getElementById("loadingScreen");
    const googleLoginBtn = document.getElementById("googleLogin");
    const darkModeToggle = document.getElementById("darkModeToggle");

    /** 🔒 Password Visibility Toggle */
    togglePassword.addEventListener("click", function () {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            this.innerHTML = '<i class="fa fa-eye-slash"></i>';
        } else {
            passwordInput.type = "password";
            this.innerHTML = '<i class="fa fa-eye"></i>';
        }
    });

    /** 🔄 Load Saved Credentials (Remember Me) */
    if (localStorage.getItem("rememberedEmail")) {
        emailInput.value = localStorage.getItem("rememberedEmail");
        rememberMeCheckbox.checked = true;
    }

    /** 🔥 Handle Login */
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        showLoading(true);

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            showAlert("Please fill in all fields", "error");
            showLoading(false);
            return;
        }

        try {
            const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
            showAlert(`Welcome back, ${userCredential.user.email}!`, "success");

            if (rememberMeCheckbox.checked) {
                localStorage.setItem("rememberedEmail", email);
            } else {
                localStorage.removeItem("rememberedEmail");
            }

            setTimeout(() => {
                window.location.href = "dashboard.html"; // Redirect after successful login
            }, 1000);
        } catch (error) {
            showAlert(getFirebaseError(error.code), "error");
        } finally {
            showLoading(false);
        }
    });

    /** 🔥 Google Sign-In */
    googleLoginBtn.addEventListener("click", async () => {
        showLoading(true);
        const provider = new firebase.auth.GoogleAuthProvider();

        try {
            const result = await firebase.auth().signInWithPopup(provider);
            showAlert(`Welcome, ${result.user.displayName}!`, "success");
            setTimeout(() => {
                window.location.href = "dashboard.html"; // Redirect
            }, 1000);
        } catch (error) {
            showAlert(getFirebaseError(error.code), "error");
        } finally {
            showLoading(false);
        }
    });

    /** 🌙 Dark Mode Toggle */
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
    }

    darkModeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("darkMode", "enabled");
        } else {
            localStorage.removeItem("darkMode");
        }
    });

    /** 🔄 Helper Functions */
    function showLoading(isLoading) {
        loadingScreen.style.display = isLoading ? "flex" : "none";
    }

    function showAlert(message, type) {
        const alertBox = document.createElement("div");
        alertBox.className = `alert ${type}`;
        alertBox.textContent = message;
        document.body.appendChild(alertBox);

        setTimeout(() => alertBox.remove(), 3000);
    }

    function getFirebaseError(code) {
        const errorMessages = {
            "auth/invalid-email": "Invalid email format.",
            "auth/user-disabled": "User account has been disabled.",
            "auth/user-not-found": "No account found with this email.",
            "auth/wrong-password": "Incorrect password.",
            "auth/network-request-failed": "Network error. Check your connection.",
            "auth/popup-closed-by-user": "Google sign-in was closed before completion.",
        };
        return errorMessages[code] || "An unknown error occurred. Try again.";
    }
});
