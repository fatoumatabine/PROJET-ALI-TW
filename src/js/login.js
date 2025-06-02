document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');

    // Redirect to chat if already logged in
    if (localStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = 'index.html';
        return; // Stop further execution of this script
    }

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission

        const username = event.target.username.value;
        const password = event.target.password.value;

        // --- Hardcoded credentials (for demonstration purposes) ---
        // In a real application, you would send these to a server for validation.
        const validUsername = 'user';
        const validPassword = 'password';
        // --- ---

        if (username === validUsername && password === validPassword) {
            // Store login status in localStorage
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username); // Optionally store username

            // Redirect to the main chat application
            window.location.href = 'index.html';
        } else {
            loginError.textContent = 'Invalid username or password.';
            // Clear password field for security
            event.target.password.value = '';
        }
    });
});
