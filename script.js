document.addEventListener("DOMContentLoaded", function () {
    // Handle Registration
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const username = document.getElementById("registerUsername").value;
            const password = document.getElementById("registerPassword").value;
            
            // Save to Local Storage (Temporary Database)
            localStorage.setItem("username", username);
            localStorage.setItem("password", password);
            
            alert("Account created successfully! Please log in.");
            window.location.href = "login.html";
        });
    }

    // Handle Login
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const username = document.getElementById("loginUsername").value;
            const password = document.getElementById("loginPassword").value;
            
            // Get stored credentials
            const storedUsername = localStorage.getItem("username");
            const storedPassword = localStorage.getItem("password");
            
            if (username === storedUsername && password === storedPassword) {
                alert("Login successful!");
                window.location.href = "index.html"; // Redirect to homepage
            } else {
                alert("Invalid username or password. Try again.");
            }
        });
    }
});
