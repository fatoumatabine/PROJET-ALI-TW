import { appData } from '../data/appData.js';
import { afficherContacts } from '../components/contacts.js';
import { afficherGroupes } from '../components/groups.js';
import { afficherDiffusion, afficherArchives, afficherNouveauContact } from '../components/sections.js';
import { envoyerMessage, filtrerContacts } from '../components/messages.js';
import { archiverConversation, bloquerContact, supprimerConversation } from '../components/actions.js';

export function initializeApp() {
    document.querySelector('.sidebar-btn[data-section="messages"]').classList.add('active-section');
}

export function setupEventListeners() {
    // Navigation dans la barre latérale
    document.querySelectorAll('.sidebar-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.dataset.section;
            changerSection(section);
        });
    });

    // Bouton d'envoi de message
    document.getElementById('sendBtn')?.addEventListener('click', envoyerMessage);
    
    // Envoi avec Entrée
    document.getElementById('messageText')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            envoyerMessage();
        }
    });

    // Recherche de contacts
    document.getElementById('searchContacts')?.addEventListener('input', function() {
        const terme = this.value.toLowerCase();
        filtrerContacts(terme);
    });

    // Boutons d'action
    document.getElementById('archiveBtn')?.addEventListener('click', archiverConversation);
    document.getElementById('blockBtn')?.addEventListener('click', bloquerContact);
    document.getElementById('deleteBtn')?.addEventListener('click', supprimerConversation);
}

export function changerSection(section) {
    // Mettre à jour les boutons actifs
    document.querySelectorAll('.sidebar-btn').forEach(btn => {
        btn.classList.remove('active-section');
    });
    document.querySelector(`[data-section="${section}"]`)?.classList.add('active-section');
    
    appData.currentSection = section;
    
    // Afficher le contenu correspondant
    switch(section) {
        case 'messages':
            afficherContacts();
            break;
        case 'groups':
            afficherGroupes();
            break;
        case 'broadcast':
            afficherDiffusion();
            break;
        case 'archives':
            afficherArchives();
            break;
        case 'new':
            afficherNouveauContact();
            break;
    }
}