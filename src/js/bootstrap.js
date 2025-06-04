import { ChatApp } from './app.js';
import { checkAuth } from './auth.js';

// Vérifier l'authentification
checkAuth();

// Initialiser l'application
document.addEventListener('DOMContentLoaded', () => {
    const app = new ChatApp();
    app.initialize();
});