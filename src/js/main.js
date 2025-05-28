import { appData } from './data/appData.js';
import { afficherContacts } from './components/contacts.js';
import { ajouterToastifyCSS } from './utils/notifications.js';

document.addEventListener('DOMContentLoaded', function() {
    console.log('Initialisation...'); // Debug
    ajouterToastifyCSS();
    initializeApp();
    setupEventListeners();
    
    // Ajoutons des logs pour déboguer
    console.log('Contacts disponibles:', appData.contacts);
    afficherContacts();
});