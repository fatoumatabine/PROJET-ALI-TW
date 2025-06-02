import { appData } from '../app-data.js';
import { creerElementContact, creerElementGroupe } from '../ui/index.js';
import { debounce } from '../utils.js';

export function setupSearch() {
    const searchInput = document.getElementById('searchContacts');
    searchInput.addEventListener('input', debounce(handleSearch, 300));
}

function handleSearch(e) {
    const terme = e.target.value.toLowerCase();
    
    // Si l'utilisateur tape "*", affiche tout par ordre alphabétique
    if (terme === "*") {
        appData.contacts.sort((a, b) => a.nom.localeCompare(b.nom));
        afficherContacts();
        return;
    }
    
    const contactsList = document.getElementById('contactsList');
    const currentSection = appData.currentSection;
    
    if (currentSection === 'messages' || currentSection === 'archives') {
        // Filtrer les contacts
        const filteredContacts = appData.contacts
            .filter(contact => 
                (currentSection === 'archives' ? contact.archive : !contact.archive) &&
                (contact.nom.toLowerCase().includes(terme) || 
                (contact.telephone && contact.telephone.includes(terme)))
            .sort((a, b) => a.nom.localeCompare(b.nom));
        
        contactsList.innerHTML = '';
        filteredContacts.forEach(contact => {
            contactsList.appendChild(creerElementContact(contact));
        });
    } 
    else if (currentSection === 'groups') {
        // Filtrer les groupes
        const filteredGroups = appData.groupes
            .filter(groupe => 
                groupe.nom.toLowerCase().includes(terme) ||
                groupe.membres.some(membre => membre.toLowerCase().includes(terme)))
            .sort((a, b) => a.nom.localeCompare(b.nom));
        
        contactsList.innerHTML = '';
        filteredGroups.forEach(groupe => {
            contactsList.appendChild(creerElementGroupe(groupe));
        });
    }
}