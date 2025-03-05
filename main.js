// 🌙 Dark Mode Toggle
const toggleDarkMode = document.getElementById('dark-mode-toggle');
const body = document.body;

// Check if user has a preferred theme
if (localStorage.getItem('dark-mode') === 'enabled') {
    body.classList.add('dark-mode');
}

// Toggle dark mode on button click
toggleDarkMode.addEventListener('click', () => {
    body.classList.toggle('dark-mode');

    // Save user preference
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('dark-mode', 'enabled');
    } else {
        localStorage.setItem('dark-mode', 'disabled');
    }
});

// 🌍 Smooth Scrolling for Navigation
document.querySelectorAll('nav ul li a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop - 60,
                behavior: 'smooth'
            });
        }
    });
});

// 🎉 Basic Button Interactions
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mousedown', () => {
        button.style.transform = 'scale(0.95)';
    });

    button.addEventListener('mouseup', () => {
        button.style.transform = 'scale(1)';
    });

    button.addEventListener('mouseleave', () => {
        button.style.transform = 'scale(1)';
    });
});

console.log("🚀 JavaScript Loaded!");
