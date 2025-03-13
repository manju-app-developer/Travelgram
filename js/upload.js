// ======== ADVANCED UPLOAD FILE PAGE ========
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { app } from "../firebase/firebase-config.js"; // Firebase config

const auth = getAuth(app);
const storage = getStorage(app);

const fileInput = document.getElementById("fileInput");
const dropZone = document.getElementById("dropZone");
const uploadBtn = document.getElementById("uploadBtn");
const progressBar = document.getElementById("progressBar");
const preview = document.getElementById("preview");
const statusMessage = document.getElementById("statusMessage");

// ======= CHECK IF USER IS LOGGED IN =======
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login.html"; // Redirect if not logged in
    }
});

// ======= DRAG & DROP FUNCTIONALITY =======
dropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropZone.style.background = "#f1f1f1";
});

dropZone.addEventListener("dragleave", () => {
    dropZone.style.background = "transparent";
});

dropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    dropZone.style.background = "transparent";

    const file = event.dataTransfer.files[0];
    if (file) {
        fileInput.files = event.dataTransfer.files;
        previewFile(file);
    }
});

// ======= PREVIEW FILE BEFORE UPLOAD =======
fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) {
        previewFile(file);
    }
});

function previewFile(file) {
    if (!file.type.startsWith("image/")) {
        alert("Only image files are allowed!");
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert("File size must be under 5MB!");
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        preview.src = e.target.result;
        preview.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
}

// ======= UPLOAD FUNCTION =======
uploadBtn.addEventListener("click", async () => {
    const file = fileInput.files[0];
    if (!file) {
        alert("Please select a file first!");
        return;
    }

    // File validation
    if (!file.type.startsWith("image/")) {
        alert("Only image files are allowed!");
        return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert("File size must be under 5MB!");
        return;
    }

    const user = auth.currentUser;
    if (!user) {
        alert("You must be logged in to upload!");
        return;
    }

    const storageRef = ref(storage, `uploads/${user.uid}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on("state_changed",
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            progressBar.value = progress;
            statusMessage.textContent = `Uploading... ${Math.round(progress)}%`;
        },
        (error) => {
            console.error("Upload error:", error.message);
            statusMessage.textContent = "Upload failed!";
        },
        async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            statusMessage.textContent = "Upload successful!";
            console.log("File available at:", downloadURL);
            alert("File uploaded successfully!");
        }
    );
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
