document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    
    // Identifiants admin (à stocker de manière sécurisée dans un vrai projet)
    const ADMIN_USERNAME = "admin";
    const ADMIN_PASSWORD = "1234";

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            Toastify({
                text: "Connexion admin réussie!",
                duration: 2000,
                gravity: "top",
                position: "right",
                backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
                close: true
            }).showToast();

            // Stocker l'état de connexion
            sessionStorage.setItem('isAdminLoggedIn', 'true');

            setTimeout(() => {
                window.location.href = "mess.html";
            }, 1000);
        } else {
            Toastify({
                text: "Identifiants administrateur incorrects!",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
                close: true
            }).showToast();
        }
    });
});