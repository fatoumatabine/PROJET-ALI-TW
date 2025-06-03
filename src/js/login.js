document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    
    // Credentials admin (à sécuriser dans un vrai projet)
    const ADMIN_USERNAME = "admin";
    const ADMIN_PASSWORD = "123";

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        // Vérification des credentials
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            // Message de succès
            Toastify({
                text: "Connexion réussie! Redirection...",
                duration: 2000,
                gravity: "top",
                position: "right",
                backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
                close: true
            }).showToast();

            // Stocker l'état de connexion
            sessionStorage.setItem('isAdminLoggedIn', 'true');

            // Redirection vers mess.html après 1 seconde
            setTimeout(() => {
                window.location.href = "/public/mess.html";
            }, 1000);
        } else {
            // Message d'erreur
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