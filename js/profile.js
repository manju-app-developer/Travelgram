// ======== USER PROFILE PAGE ========
import { 
    getAuth, onAuthStateChanged, signOut, updateProfile 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { app } from "../firebase/firebase-config.js"; // Firebase config

const auth = getAuth(app);
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const profilePic = document.getElementById("profilePic");
const editNameInput = document.getElementById("editName");
const editNameBtn = document.getElementById("editNameBtn");
const profilePicUpload = document.getElementById("profilePicUpload");

// ======= CHECK IF USER IS LOGGED IN =======
onAuthStateChanged(auth, (user) => {
    if (user) {
        userName.textContent = user.displayName || "No Name";
        userEmail.textContent = user.email;
        profilePic.src = user.photoURL || "default.png"; // Default if no photo
    } else {
        window.location.href = "login.html"; // Redirect if not logged in
    }
});

// ======= EDIT USERNAME =======
editNameBtn.addEventListener("click", async () => {
    const newName = editNameInput.value.trim();
    if (newName === "") return alert("Name cannot be empty!");

    try {
        await updateProfile(auth.currentUser, { displayName: newName });
        userName.textContent = newName;
        alert("Name updated successfully!");
    } catch (error) {
        console.error("Error updating name:", error.message);
        alert("Failed to update name!");
    }
});

// ======= PROFILE PICTURE UPLOAD =======
profilePicUpload.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            await updateProfile(auth.currentUser, { photoURL: e.target.result });
            profilePic.src = e.target.result;
            alert("Profile picture updated!");
        } catch (error) {
            console.error("Error updating profile picture:", error.message);
            alert("Failed to update profile picture!");
        }
    };
    reader.readAsDataURL(file);
});

// ======= LOGOUT FUNCTION =======
document.getElementById("logout").addEventListener("click", async () => {
    const confirmLogout = confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    try {
        await signOut(auth);
        window.location.href = "login.html"; // Redirect to login page
    } catch (error) {
        console.error("Logout error:", error.message);
    }
});
