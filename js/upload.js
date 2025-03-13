// ======== ADVANCED UPLOAD FILE PAGE ========
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { app } from "../firebase/firebase-config.js"; // Firebase config

const auth = getAuth(app);
const storage = getStorage(app);

// Select elements
const fileInput = document.getElementById("fileInput");
const fileName = document.getElementById("fileName");
const fileSize = document.getElementById("fileSize");
const fileType = document.getElementById("fileType");
const fileDetails = document.getElementById("fileDetails");
const uploadBtn = document.getElementById("uploadBtn");
const cancelBtn = document.getElementById("cancelBtn");
const progressBar = document.getElementById("progressBar");
const preview = document.getElementById("preview");
const statusMessage = document.getElementById("statusMessage");

// Track upload task
let uploadTask = null;

// ======= CHECK IF USER IS LOGGED IN =======
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login.html"; // Redirect if not logged in
    }
});

// ======= HANDLE FILE SELECTION =======
fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) {
        displayFileDetails(file);
        uploadBtn.disabled = false; // Enable upload button
    }
});

function displayFileDetails(file) {
    // Show file details
    fileName.textContent = file.name;
    fileSize.textContent = (file.size / 1024 / 1024).toFixed(2) + " MB";
    fileType.textContent = file.type || "Unknown";
    fileDetails.classList.remove("hidden");

    // Show image preview if it's an image
    if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
            preview.classList.remove("hidden");
        };
        reader.readAsDataURL(file);
    } else {
        preview.classList.add("hidden");
    }
}

// ======= UPLOAD FUNCTION =======
uploadBtn.addEventListener("click", async () => {
    const file = fileInput.files[0];
    if (!file) {
        alert("Please select a file first!");
        return;
    }

    // File validation
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert("File size must be under 10MB!");
        return;
    }

    const user = auth.currentUser;
    if (!user) {
        alert("You must be logged in to upload!");
        return;
    }

    // Disable buttons during upload
    uploadBtn.disabled = true;
    cancelBtn.classList.remove("hidden");

    const storageRef = ref(storage, `uploads/${user.uid}/${file.name}`);
    uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on("state_changed",
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            progressBar.value = progress;
            progressBar.classList.remove("hidden");
            statusMessage.textContent = `Uploading... ${Math.round(progress)}%`;
        },
        (error) => {
            console.error("Upload error:", error.message);
            statusMessage.textContent = "Upload failed!";
            alert("Upload failed! Try again.");
            resetUploadUI();
        },
        async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            statusMessage.textContent = "Upload successful!";
            console.log("File available at:", downloadURL);
            alert("File uploaded successfully!");
            resetUploadUI();
        }
    );
});

// ======= CANCEL UPLOAD FUNCTION =======
cancelBtn.addEventListener("click", () => {
    if (uploadTask) {
        uploadTask.cancel();
        statusMessage.textContent = "Upload canceled!";
        alert("Upload canceled!");
        resetUploadUI();
    }
});

// ======= RESET UI AFTER UPLOAD/CANCEL =======
function resetUploadUI() {
    uploadBtn.disabled = false;
    cancelBtn.classList.add("hidden");
    progressBar.value = 0;
    progressBar.classList.add("hidden");
}

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
