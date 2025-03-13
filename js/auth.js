// ============ AUTHENTICATION SYSTEM ============

import { 
    getAuth, createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, signInWithPopup, 
    GoogleAuthProvider, signOut, onAuthStateChanged, 
    setPersistence, browserLocalPersistence 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { app } from "../firebase/firebase-config.js"; // Firebase app instance

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// ======= Enable Session Persistence =======
setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error("Persistence error:", error.message);
});

// ======= Utility Functions =======
const showLoading = (button) => {
    button.disabled = true;
    button.innerHTML = "Processing...";
};

const hideLoading = (button, text) => {
    button.disabled = false;
    button.innerHTML = text;
};

/** 🔄 Map Firebase Auth Errors */
function mapAuthError(errorCode) {
    const errors = {
        "auth/email-already-in-use": "This email is already in use. Try logging in.",
        "auth/invalid-email": "Invalid email format. Please check again.",
        "auth/weak-password": "Password is too weak. Try a stronger one.",
        "auth/user-not-found": "No user found with this email.",
        "auth/wrong-password": "Incorrect password. Please try again.",
        "auth/popup-closed-by-user": "Google sign-in was canceled.",
        "auth/network-request-failed": "Network error. Check your internet connection.",
        "auth/too-many-requests": "Too many failed attempts. Try again later.",
    };
    return errors[errorCode] || "An unknown error occurred.";
}

// ======= SIGN UP =======
document.getElementById("signupForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const email = document.getElementById("signupEmail").value.trim().toLowerCase();
    const password = document.getElementById("signupPassword").value;
    const signupBtn = document.querySelector("#signupForm button");

    if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
        return;
    }

    showLoading(signupBtn);

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("Signup successful:", userCredential.user);
        alert("Signup successful! Please log in.");
        window.location.href = "login.html";
    } catch (error) {
        console.error("Signup error:", error.message);
        alert(mapAuthError(error.code));
    } finally {
        hideLoading(signupBtn, "Sign Up");
    }
});

// ======= LOGIN =======
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const loginBtn = document.querySelector("#loginForm button");

    showLoading(loginBtn);

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Login successful:", userCredential.user);
        localStorage.setItem("user", JSON.stringify(userCredential.user));
        window.location.href = "dashboard.html"; // Redirect to dashboard
    } catch (error) {
        console.error("Login error:", error.message);
        alert(mapAuthError(error.code));
    } finally {
        hideLoading(loginBtn, "Login");
    }
});

// ======= GOOGLE LOGIN =======
document.getElementById("googleLogin")?.addEventListener("click", async () => {
    const googleBtn = document.getElementById("googleLogin");
    showLoading(googleBtn);

    try {
        const result = await signInWithPopup(auth, provider);
        console.log("Google Sign-In successful:", result.user);
        localStorage.setItem("user", JSON.stringify(result.user));
        window.location.href = "dashboard.html"; // Redirect to dashboard
    } catch (error) {
        console.error("Google Login error:", error.message);
        alert(mapAuthError(error.code));
    } finally {
        hideLoading(googleBtn, "Login with Google");
    }
});

// ======= LOGOUT =======
document.getElementById("logout")?.addEventListener("click", async () => {
    try {
        await signOut(auth);
        localStorage.removeItem("user");
        window.location.href = "login.html"; // Redirect to login page
    } catch (error) {
        console.error("Logout error:", error.message);
        alert("Error logging out. Please try again.");
    }
});

// ======= AUTO-REDIRECT IF LOGGED IN =======
onAuthStateChanged(auth, (user) => {
    if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        if (window.location.pathname.includes("login.html") || window.location.pathname.includes("signup.html")) {
            window.location.href = "dashboard.html"; // Redirect logged-in users
        }
    } else {
        localStorage.removeItem("user");
    }
});

// ======= CHECK ADMIN ROLE (For Future Use) =======
export async function isAdmin(user) {
    try {
        const tokenResult = await user.getIdTokenResult();
        return tokenResult.claims.admin === true;
    } catch (error) {
        console.error("Admin check failed:", error.message);
        return false;
    }
}
