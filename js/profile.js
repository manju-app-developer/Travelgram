import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { app } from "../firebase/firebase-config.js";

const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", () => {
    const userName = document.getElementById("userName");
    const userEmail = document.getElementById("userEmail");
    const editName = document.getElementById("editName");
    const editNameBtn = document.getElementById("editNameBtn");
    const logoutBtn = document.getElementById("logout");

    // Check authentication state
    onAuthStateChanged(auth, (user) => {
        if (user) {
            userName.textContent = user.displayName || "No Name Set";
            userEmail.textContent = user.email;

            // Allow name editing
            editNameBtn.addEventListener("click", () => {
                if (editName.style.display === "none") {
                    editName.style.display = "block";
                    editName.value = user.displayName || "";
                    editName.focus();
                } else {
                    const newName = editName.value.trim();
                    if (newName) {
                        userName.textContent = newName;
                        editName.style.display = "none";
                        localStorage.setItem("userName", newName); // Save locally
                    }
                }
            });
        } else {
            // Redirect to login if not authenticated
            window.location.href = "login.html";
        }
    });

    // Logout Function
    logoutBtn.addEventListener("click", async () => {
        try {
            await signOut(auth);
            localStorage.removeItem("userName");
            localStorage.removeItem("profilePic");
            window.location.href = "login.html";
        } catch (error) {
            console.error("Logout Error:", error.message);
            alert("Error logging out. Please try again.");
        }
    });

    // Load stored name
    const storedName = localStorage.getItem("userName");
    if (storedName) {
        userName.textContent = storedName;
    }
});
