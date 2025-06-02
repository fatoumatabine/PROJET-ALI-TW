import { appData } from './app-data.js';
import { creerElementContact } from './contacts.js';

export function setupSearch() {
    const searchInput = document.getElementById('searchContacts');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const terme = this.value.toLowerCase();
            filtrerContacts(terme);
        });
    }
}

export function filtrerContacts(terme) {
    const contactsList = document.getElementById('contactsList');
    
    if (terme === "*") {
        const contacts = [...appData.contacts]
            .filter(contact => !contact.archive)
            .sort((a, b) => a.nom.localeCompare(b.nom));
        
        contactsList.innerHTML = '';
        contacts.forEach(contact => {
            const contactElement = creerElementContact(contact);
            contactsList.appendChild(contactElement);
        });
        return;
    }

    const items = document.querySelectorAll('#contactsList > div');
    items.forEach(item => {
        const nom = item.querySelector('h4');
        const telephone = item.dataset.telephone || '';
        
        if (nom) {
            const texteNom = nom.textContent.toLowerCase();
            const texteTelephone = telephone.toLowerCase();
            
            if (texteNom.includes(terme) || texteTelephone.includes(terme)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        }
    });
}