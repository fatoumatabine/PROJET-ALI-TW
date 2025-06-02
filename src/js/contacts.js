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

    // Validation du nom (pas de doublon)
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

    // Validation du numéro de téléphone
    telInput.addEventListener('input', (e) => {
        let value = e.target.value;
        
        // Supprimer tout ce qui n'est pas un chiffre
        value = value.replace(/[^0-9]/g, '');
        
        // Limiter à 9 chiffres
        value = value.substring(0, 9);
        
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

        // Vérifier si le nom existe déjà
        if (appData.contacts.some(contact => contact.nom.toLowerCase() === nom.toLowerCase())) {
            showNotification('Ce nom existe déjà', 'error');
            return;
        }

        // Vérifier le format du numéro
        if (tel.length !== 9 || !/^\d+$/.test(tel)) {
            showNotification('Format du numéro invalide', 'error');
            return;
        }

        // Créer le nouveau contact
        const nouveauContact = {
            id: Math.max(...appData.contacts.map(c => c.id)) + 1,
            nom: nom,
            telephone: tel,
            statut: "offline",
            avatar: nom.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2),
            archive: false,
            isOnline: false,
            messages: []
        };

        appData.contacts.push(nouveauContact);
        showNotification('Contact ajouté avec succès !', 'success');
        form.reset();
        afficherContacts();
    });
}

export function creerElementContact(contact) {
    const div = document.createElement('div');
    div.className = 'p-3 bg-white border rounded-lg cursor-pointer hover:bg-gray-100 transition duration-200';
    div.dataset.telephone = contact.telephone || '';
    
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
                        contact.isOnline ? 'bg-green-500' : 'bg-gray-400'
                    } mr-2"></span>
                    <span class="text-sm text-gray-500">${
                        contact.isOnline ? 'En ligne' : 'Hors ligne'
                    }</span>
                </div>
                <div class="text-xs text-gray-400">${contact.telephone || ''}</div>
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

export function afficherContacts() {
    const contactsList = document.getElementById('contactsList');
    if (!contactsList) return;
    
    contactsList.innerHTML = '';
    
    appData.contacts
        .filter(contact => !contact.archive)
        .forEach(contact => {
            contactsList.appendChild(creerElementContact(contact));
        });
}

export function selectionnerContact(contact) {
    appData.currentContact = contact;
    mettreAJourInfoContact(contact);
    afficherMessages(contact.messages);
}

export function bloquerContact() {
    if (appData.currentContact) {
        appData.currentContact.bloque = true;
        showNotification(`${appData.currentContact.nom} bloqué`, 'warning');
    }
}

export function toggleArchive() {
    if (!appData.currentContact) return;
    
    appData.currentContact.archive = !appData.currentContact.archive;
    showNotification(
        `Contact ${appData.currentContact.archive ? 'archivé' : 'désarchivé'}`,
        'info'
    );
    
    if (appData.currentSection === 'archives') {
        afficherArchives();
    } else {
        afficherContacts();
    }
}

function mettreAJourInfoContact(contact) {
    const contactInfo = document.getElementById('contactInfo');
    if (contactInfo) {
        contactInfo.innerHTML = `
            <div class="flex items-center p-4 border-b">
                <div class="w-12 h-12 rounded-full mr-3 overflow-hidden">
                    ${contact.image 
                        ? `<img src="${contact.image}" alt="${contact.nom}" class="w-full h-full object-cover">` 
                        : `<div class="w-full h-full bg-gray-500 flex items-center justify-center text-white">
                            ${contact.avatar}
                           </div>`
                    }
                </div>
                <div>
                    <h3 class="font-semibold">${contact.nom}</h3>
                    <p class="text-sm text-gray-500">${contact.telephone}</p>
                    <p class="text-xs text-gray-400">${contact.isOnline ? 'En ligne' : 'Hors ligne'}</p>
                </div>
            </div>
        `;
    }
}

function afficherMessages(messages) {
    const messagesContainer = document.getElementById('messagesContainer');
    if (messagesContainer) {
        messagesContainer.innerHTML = messages.map(message => `
            <div class="mb-4 ${message.envoyeur === 'moi' ? 'text-right' : 'text-left'}">
                <div class="inline-block max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.envoyeur === 'moi' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-800'
                }">
                    <p>${message.contenu}</p>
                    <p class="text-xs mt-1 opacity-70">${message.heure}</p>
                </div>
            </div>
        `).join('');
        
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

function afficherArchives() {
    const contactsList = document.getElementById('contactsList');
    if (!contactsList) return;
    
    contactsList.innerHTML = '';
    
    const contactsArchives = appData.contacts.filter(contact => contact.archive);
    const groupesArchives = appData.groupes.filter(groupe => groupe.archive);
    
    [...contactsArchives, ...groupesArchives].forEach(item => {
        contactsList.appendChild(creerElementContact(item));
    });
}