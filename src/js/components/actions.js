import { appData } from '../data/appData.js';
import { showNotification } from '../utils/notifications.js';
import { afficherMessages } from './messages.js';

export function archiverConversation() {
    if (appData.currentContact) {
        const contactNom = appData.currentContact.nom;
        appData.currentContact.archive = true;
        showNotification(`Conversation avec "${contactNom}" archivée`, 'info');
    }
}

export function bloquerContact() {
    if (appData.currentContact) {
        const contactNom = appData.currentContact.nom;
        appData.currentContact.bloque = true;
        showNotification(`${contactNom} a été bloqué`, 'warning');
        // Update UI to reflect blocked status
        const currentContact = document.getElementById('currentContact');
        if (currentContact) {
            const statusElement = currentContact.querySelector('p');
            if (statusElement) {
                statusElement.textContent = 'Bloqué';
                statusElement.classList.add('text-red-500');
            }
        }
    }
}

export function supprimerConversation() {
    if (appData.currentContact) {
        const contactNom = appData.currentContact.nom;
        appData.currentContact.messages = [];
        afficherMessages([]);
        showNotification(`Conversation avec ${contactNom} supprimée`, 'warning');
    }
}