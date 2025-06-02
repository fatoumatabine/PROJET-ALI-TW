import { appData, showNotification } from './app-data.js';

export function afficherNouveauContact() {
    const contactsList = document.getElementById('contactsList');
    contactsList.innerHTML = `
        <div class="bg-white p-4 rounded-lg shadow">
            <h3 class="font-semibold mb-5">Ajouter un nouveau contact</h3>
            <form id="nouveauContactForm">
                <div class="mb-3">
                    <label class="block text-sm font-medium mb-1">Nom complet</label>
                    <input type="text" 
                        id="nouveauNom" 
                        class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300" 
                        required>
                </div>
                <div class="mb-3">
                    <label class="block text-sm font-medium mb-1">Téléphone</label>
                    <input type="tel" 
                        id="nouveauTel" 
                        pattern="[0-9]*"
                        maxlength="9"
                        class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
                        required>
                    <span id="telError" class="text-red-500 text-sm hidden">Veuillez entrer uniquement des chiffres</span>
                </div>
                <button type="submit" class="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600">
                    Ajouter le contact
                </button>
            </form>
        </div>
    `;

    const form = document.getElementById('nouveauContactForm');
    const nomInput = document.getElementById('nouveauNom');
    const telInput = document.getElementById('nouveauTel');
    const telError = document.getElementById('telError');

    nomInput.addEventListener('input', (e) => {
        const nomExiste = appData.contacts.some(contact => 
            contact.nom.toLowerCase() === e.target.value.toLowerCase()
        );
        
        if (nomExiste) {
            nomInput.setCustomValidity('Ce nom existe déjà');
            showNotification('Ce nom existe déjà', 'error');
        } else {
            nomInput.setCustomValidity('');
        }
    });

    telInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/[^0-9]/g, '').substring(0, 9);
        telInput.value = value;
        
        if (value.length !== 9) {
            telError.textContent = 'Le numéro doit contenir 9 chiffres';
            telError.classList.remove('hidden');
        } else {
            telError.classList.add('hidden');
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nom = nomInput.value.trim();
        const tel = telInput.value.trim();

        if (appData.contacts.some(contact => contact.nom.toLowerCase() === nom.toLowerCase())) {
            showNotification('Ce nom existe déjà', 'error');
            return;
        }

        if (tel.length !== 9 || !/^\d+$/.test(tel)) {
            showNotification('Format du numéro invalide', 'error');
            return;
        }

        const maxId = appData.contacts.length > 0 
            ? Math.max(...appData.contacts.map(c => c.id)) 
            : 0;

        const nouveauContact = {
            id: maxId + 1,
            nom,
            telephone: tel,
            statut: "offline",
            avatar: nom.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2),
            archive: false,
            messages: []
        };

        appData.contacts.push(nouveauContact);
        showNotification('Contact ajouté avec succès !', 'success');
        form.reset();
        afficherContacts(); // ⚠️ À définir
    });
}

export function creerElementContact(contact) {
    const div = document.createElement('div');
    div.className = 'p-3 bg-white border rounded-lg cursor-pointer hover:bg-gray-100 transition duration-200';
    div.innerHTML = `
        <div class="flex items-center">
            <div class="w-10 h-10 rounded-full mr-3 overflow-hidden">
                ${contact.image 
                    ? `<img src="${contact.image}" alt="${contact.nom}" class="w-full h-full object-cover">` 
                    : `<div class="w-full h-full bg-gray-500 flex items-center justify-center text-white">
                        ${contact.avatar}
                       </div>`
                }
            </div>
            <div class="flex-1">
                <h4 class="font-semibold">${contact.nom}</h4>
                <div class="flex items-center">
                    <span class="inline-block w-2 h-2 rounded-full ${
                        contact.statut === 'online' ? 'bg-green-500' : 'bg-gray-400'
                    } mr-2"></span>
                    <span class="text-sm text-gray-500">
                        ${contact.statut === 'online' ? 'En ligne' : 'Hors ligne'}
                    </span>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <span class="text-xs text-gray-500">
                    ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>
        </div>
    `;
    
    div.addEventListener('click', () => selectionnerContact(contact));
    return div;
}

// Sélection d'un contact
function selectionnerContact(contact) {
    appData.currentContact = contact;
    mettreAJourInfoContact(contact); // ⚠️ À définir
    afficherMessages(contact.messages); // ⚠️ À définir
}

// Bloquer un contact
export function bloquerContact() {
    if (appData.currentContact) {
        appData.currentContact.bloque = true;
        showNotification(`${appData.currentContact.nom} bloqué`, 'warning');
    }
}

// Archiver un contact
export function toggleArchive() {
    if (!appData.currentContact) return;
    
    appData.currentContact.archive = !appData.currentContact.archive;
    showNotification(
        `Contact ${appData.currentContact.archive ? 'archivé' : 'désarchivé'}`,
        'info'
    );

    if (appData.currentSection === 'archives') {
        afficherArchives(); // ⚠️ À définir
    } else {
        afficherContacts(); // ⚠️ À définir
    }
}
