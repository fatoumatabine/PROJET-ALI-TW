import { appData } from '../data/appData.js';
import { creerElementContact } from './contacts.js';

export function afficherDiffusion() {
    const contactsList = document.getElementById('contactsList');
    const discussionsTitle = document.querySelector('section h2');
    discussionsTitle.textContent = 'Listes de diffusion';
    contactsList.innerHTML = '<p class="text-gray-500 text-center mt-8">Aucune liste de diffusion</p>';
}

export function afficherArchives() {
    const contactsList = document.getElementById('contactsList');
    const discussionsTitle = document.querySelector('section h2');
    discussionsTitle.textContent = 'Archives';
    
    contactsList.innerHTML = '';
    
    const contactsArchives = appData.contacts.filter(contact => contact.archive);
    
    if (contactsArchives.length === 0) {
        contactsList.innerHTML = '<p class="text-gray-500 text-center mt-8">Aucune conversation archivée</p>';
        return;
    }
    
    contactsArchives.forEach(contact => {
        const contactElement = creerElementContact(contact);
        contactsList.appendChild(contactElement);
    });
}

export function afficherNouveauContact() {
    const contactsList = document.getElementById('contactsList');
    const discussionsTitle = document.querySelector('section h2');
    discussionsTitle.textContent = 'Nouveau Contact';
    
    contactsList.innerHTML = `
        <div class="bg-white p-4 rounded-lg border">
            <h3 class="font-semibold mb-5 bg-yellow-50">Ajouter un nouveau contact</h3>
            <form id="nouveauContactForm">
                <div class="mb-3">
                    <label class="block text-sm font-medium mb-1">Nom complet</label>
                    <input type="text" id="nouveauNom" class="w-[50%] px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300" required>
                </div>
                <div class="mb-3">
                    <label class="block text-sm font-medium mb-1">Téléphone (optionnel)</label>
                    <input type="tel" id="nouveauTel" class="w-[50%] px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300">
                </div>
                <button type="submit" class="w-[40%] bg-yellow-700 text-white py-4 rounded-lg hover:bg-green-600">
                    Ajouter le contact
                </button>
            </form>
        </div>
    `;

    // Add form submit event listener
    document.getElementById('nouveauContactForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        ajouterNouveauContact();
    });
}