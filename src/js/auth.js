import { appData, showNotification } from './app-data.js';

export function afficherPageConnexion() {
    document.body.innerHTML = `
        <div class="min-h-screen flex items-center justify-center bg-gray-100">
            <div class="bg-white p-8 rounded-lg shadow-md w-96">
                <h1 class="text-2xl font-bold mb-6 text-center">Connexion</h1>
                <form id="loginForm">
                    <div class="mb-4">
                        <label class="block text-sm font-medium mb-1">Email</label>
                        <input type="email" id="email" required
                            class="w-full px-3 py-2 border rounded-lg">
                    </div>
                    <div class="mb-6">
                        <label class="block text-sm font-medium mb-1">Mot de passe</label>
                        <input type="password" id="password" required
                            class="w-full px-3 py-2 border rounded-lg">
                    </div>
                    <button type="submit"
                        class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
                        Se connecter
                    </button>
                </form>
            </div>
        </div>
    `;

    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (email && password) {
            appData.currentUser = { email, nom: "Utilisateur" };
            appData.isAuthenticated = true;
            location.reload();
        }
    });
}

export function setupAuth() {
    if (!appData.isAuthenticated) {
        afficherPageConnexion();
        return false;
    }
    return true;
}

export function deconnecter() {
    appData.isAuthenticated = false;
    appData.currentUser = null;
    afficherPageConnexion();
    showNotification("Vous avez été déconnecté", "info");
}