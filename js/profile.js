<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Profile</title>
    <link rel="stylesheet" href="styles.css"> <!-- Link to external CSS file -->
</head>
<body>

    <div class="profile-container">
        <h2>User Profile</h2>
        <div class="profile-card">
            <img id="profilePic" src="default.png" alt="Profile Picture">
            <input type="file" id="profilePicUpload" accept="image/*" hidden>
            <button id="changeProfilePic">Change Profile Picture</button>

            <h3 id="userName">Loading...</h3>
            <p id="userEmail">Loading...</p>

            <div class="edit-section">
                <input type="text" id="editName" placeholder="Enter new name">
                <button id="editNameBtn">Update Name</button>
            </div>

            <button id="logout" class="logout-btn">Logout</button>
        </div>
    </div>

    <script type="module">
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
        const changeProfilePicBtn = document.getElementById("changeProfilePic");

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
        changeProfilePicBtn.addEventListener("click", () => {
            profilePicUpload.click();
        });

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
    </script>

</body>
</html>
