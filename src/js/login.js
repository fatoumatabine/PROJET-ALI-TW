document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    
    // Admin credentials
    const ADMIN_USERNAME = "admin";
    const ADMIN_PASSWORD = "123";

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            Toastify({
                text: "Connexion réussie! Redirection...",
                duration: 2000,
                gravity: "top",
                position: "right",
                backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
                close: true
            }).showToast();

            // Store login state
            sessionStorage.setItem('isAdminLoggedIn', 'true');

            // Correction du chemin de redirection
            setTimeout(() => {
    window.location.href = "/mess.html"; // Chemin correct depuis la racine
            }, 1000);
        } else {
            Toastify({
                text: "Identifiants incorrects!",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
                close: true
            }).showToast();
        }
    });
});