import { appData } from '../data/appData.js';
import { showNotification } from '../utils/notifications.js';
import { afficherMessages } from './messages.js';

export function afficherContacts() {
    console.log('Tentative d\'affichage des contacts...'); // Debug
    
    const contactsList = document.getElementById('contactsList');
    if (!contactsList) {
        console.error('contactsList non trouvé!');
        return;
    }
    
    console.log('Contacts disponibles:', appData.contacts); // Debug
    
    contactsList.innerHTML = '';
    appData.contacts
        .filter(contact => !contact.archive)
        .forEach(contact => {
            const contactElement = creerElementContact(contact);
            contactsList.appendChild(contactElement);
        });
}

export function creerElementContact(contact) {
    const div = document.createElement('div');
    div.className = 'p-3 bg-white border rounded-lg cursor-pointer hover:bg-gray-50 transition duration-200';
    div.innerHTML = `
        <div class="flex items-center">
            <div class="w-10 h-10 rounded-full mr-3 overflow-hidden">
                ${contact.image 
                    ? `<img src="${contact.image}" alt="${contact.nom}" class="w-full h-full object-cover">` 
                    : `<div class="w-full h-full bg-blue-500 flex items-center justify-center text-white">
                        ${contact.avatar}
                       </div>`
                }
            </div>
            <div class="flex-1">
                <h4 class="font-semibold">${contact.nom}</h4>
                <p class="text-sm text-gray-500">${contact.statut}</p>
            </div>
            <div class="flex items-center space-x-2">
                <button class="archive-btn p-1 rounded-full hover:bg-gray-100" title="${contact.archive ? 'Désarchiver' : 'Archiver'}">
                    <i class="fas ${contact.archive ? 'fa-box-open' : 'fa-box'} text-yellow-600"></i>
                </button>
                <div class="text-xs text-gray-400">
                    ${contact.messages.length > 0 ? contact.messages[contact.messages.length - 1].heure : ''}
                </div>
            </div>
        </div>
    `;
    
    const archiveBtn = div.querySelector('.archive-btn');
    archiveBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleArchiveContact(contact);
    });
    
    div.addEventListener('click', () => selectionnerContact(contact));
    return div;
}

export function selectionnerContact(contact) {
    appData.currentContact = contact;
    mettreAJourInfoContact(contact);
    afficherMessages(contact.messages);
}

function mettreAJourInfoContact(contact) {
    const currentContact = document.getElementById('currentContact');
    currentContact.innerHTML = `
        <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white">
            ${contact.avatar}
        </div>
        <div class="ml-3">
            <h3 class="font-semibold">${contact.nom}</h3>
            <p class="text-sm text-gray-500">${contact.statut}</p>
        </div>
    `;
}

export function toggleArchiveContact(contact) {
    contact.archive = !contact.archive;
    showNotification(
        `Contact ${contact.archive ? 'archivé' : 'désarchivé'} : ${contact.nom}`,
        'info'
    );
    
    if (appData.currentSection === 'archives') {
        afficherArchives();
    } else {
        afficherContacts();
    }
}

export function ajouterNouveauContact() {
    const nom = document.getElementById('nouveauNom').value.trim();
    const tel = document.getElementById('nouveauTel').value.trim();
    
    if (nom) {
        const initiales = nom.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2);
        
        const nouveauContact = {
            id: appData.contacts.length + 1,
            nom: nom,
            statut: 'hors ligne',
            avatar: initiales,
            messages: [],
            archive: false
        };
        
        appData.contacts.push(nouveauContact);
        showNotification(`Contact ${nom} ajouté avec succès !`);
        afficherContacts();
    }
}

export function bloquerContact() {
    if (appData.currentContact) {
        const contactNom = appData.currentContact.nom;
        appData.currentContact.bloque = true;
        showNotification(`${contactNom} a été bloqué`, 'warning');
        mettreAJourInfoContact(appData.currentContact);
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