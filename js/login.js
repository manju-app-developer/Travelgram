document.addEventListener("DOMContentLoaded", () => {
    // Password visibility toggle
    document.querySelector(".toggle-password").addEventListener("click", function () {
        let passwordInput = document.getElementById("password");
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            this.innerHTML = '<i class="fa fa-eye-slash"></i>';
        } else {
            passwordInput.type = "password";
            this.innerHTML = '<i class="fa fa-eye"></i>';
        }
    });

    // Show loading screen on login submit
    document.getElementById("loginForm").addEventListener("submit", function (e) {
        e.preventDefault();
        document.getElementById("loadingScreen").style.display = "flex";
        setTimeout(() => {
            document.getElementById("loadingScreen").style.display = "none";
        }, 2000); // Simulated delay
    });
});
