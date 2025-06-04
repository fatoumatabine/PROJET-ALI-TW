// Import des dépendances
import { checkAuth } from './auth.js';

// Base classes for data models
export class Contact {
    constructor(id, nom, statut, avatar, archive = false, isOnline = false) {
        this.id = id;
        this.nom = nom; 
        this.statut = statut;
        this.avatar = avatar;
        this.archive = archive;
        this.isOnline = isOnline;
        this.messages = [];
        this.telephone = ''; // Ajout du champ téléphone
    }

    toggleArchive() {
        this.archive = !this.archive;
        return this.archive;
    }
}

class Group {
    constructor(id, nom, membres, avatar) {
        this.id = id;
        this.nom = nom;
        this.membres = membres;
        this.avatar = avatar;

        this.messages = [];
    }

    addMember(membre) {
        if (!this.membres.includes(membre)) {
            this.membres.push(membre);
            return true;
        }
        return false;
    }

    removeMember(membre) {
        const index = this.membres.indexOf(membre);
        if (index !== -1) {
            this.membres.splice(index, 1);
            return true;
        }
        return false;
    }

    isAdmin(memberName) {
        const member = this.membres.find(m => m.nom === memberName);
        return member && member.role === 'admin';
    }
}

class Message {
    constructor(contenu, envoyeur, heure) {
        this.contenu = contenu;
        this.envoyeur = envoyeur;
        this.heure = heure;
        this.lu = false;
        this.delivered = false;
    }
}

// UI Components
class ToastNotification {
    static addCSS() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/toastify-js';
        document.head.appendChild(script);
    }

    static show(message, type = 'success', position = 'right') {
        const colors = {
            success: 'linear-gradient(to right, #00b09b, #96c93d)',
            error: 'linear-gradient(to right, #ff5f6d, #ffc371)',
            warning: 'linear-gradient(to right, #f7b733, #fc4a1a)',
            info: 'linear-gradient(to right, #2193b0, #6dd5ed)',
            archive: 'linear-gradient(to right, #8E2DE2, #4A00E0)'
        };

        const positions = {
            right: 'right',
            center: 'center',
            left: 'left'
        };

        Toastify({
            text: message,
            duration: 3000,
            gravity: type === 'archive' ? 'top' : 'bottom',
            position: positions[position],
            className: type === 'archive' ? 'archive-notification' : 'standard-notification',
            style: { 
                background: colors[type],
                marginTop: type === 'archive' ? '60px' : '0' // Pour placer sous l'en-tête
            },
            close: true
        }).showToast();
    }
}

// Storage Manager
class StorageManager {
    static saveData(data) {
        localStorage.setItem('chatAppData', JSON.stringify(data));
    }

    static loadData() {
        return JSON.parse(localStorage.getItem('chatAppData'));
    }
}

// Connection Manager
class ConnectionManager {
    static checkConnection() {
        window.addEventListener('online', () => {
            ToastNotification.show('Connexion rétablie', 'success');
        });

        window.addEventListener('offline', () => {
            ToastNotification.show('Connexion perdue', 'error');
        });
    }
}

// Theme Manager
class ThemeManager {
    static toggleDarkMode() {
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
    }

    static initTheme() {
        if (localStorage.getItem('darkMode') === 'true') {
            document.documentElement.classList.add('dark');
        }
    }
}

// Notification Manager
class NotificationManager {
    static async requestPermission() {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }
        return false;
    }

    static notify(title, options = {}) {
        if (Notification.permission === 'granted') {
            return new Notification(title, options);
        }
    }
}

// Main Application Class
export class ChatApp {
    constructor() {
        this.data = {
            contacts: [
                new Contact(1, "Malick sylla", "absent", "MS", false, true),
                new Contact(2, "Astou mbow", "absent", "BD"),
                new Contact(3, "yaye teden faye", "en ligne", "ES", false, true),
                new Contact(4, "binetou Sylla", "en ligne", "AS"),
                new Contact(5, "gnagna Sall", "en ligne", "GS", false, true)
            ],
            groupes: [
                new Group(1, "Famille", ["malick sylla", "elisabet seck", "Moi"], "FA")
            ],
            currentSection: "messages",
            currentContact: null,
            listeDiffusion: []
        };

        // Ajouter les numéros de téléphone
        this.data.contacts[0].telephone = "77 123 45 67";
        this.data.contacts[1].telephone = "76 234 56 78";
        this.data.contacts[2].telephone = "70 345 67 89";
        this.data.contacts[3].telephone = "75 456 78 90";
        this.data.contacts[4].telephone = "78 567 89 01";
    }

    setupLogout() {
        const logoutBtn = document.querySelector('[data-section="logoutBtn"]');
        if (logoutBtn) {
            // Ajout de l'icône et du texte de déconnexion
            logoutBtn.innerHTML = `
                <i class="fas fa-sign-out-alt text-white text-2xl mb-2"></i>
                <span class="text-white text-sm">Déconnexion</span>
            `;
            
            // Gestionnaire de clic pour la déconnexion
            logoutBtn.addEventListener('click', () => {
                // Supprimer les données de session
                sessionStorage.removeItem('isAdminLoggedIn');
                
                // Notification
                ToastNotification.show('Déconnexion réussie', 'info');
                
                // Redirection vers la page de connexion après 1 seconde
                setTimeout(() => {
                    window.location.href = "/";
                }, 1000);
            });
        }
    }

    initialize() {
        ToastNotification.addCSS();
        this.setupEventListeners();
        this.setupLogout();  // Ajout de l'initialisation du bouton de déconnexion
        this.showContacts();
        
        // Configurer la recherche en temps réel
        const searchInput = document.getElementById('searchContacts');
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.trim();
            this.filterContacts(searchTerm);
        });
        
        document.querySelector('.sidebar-btn[data-section="messages"]').classList.add('active-section');

        // Initialiser les boutons de la barre latérale
        document.querySelectorAll('.sidebar-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const section = btn.dataset.section;
                this.changeSection(section);
            });
        });

        // Afficher la section messages par défaut
        this.changeSection('messages');
    }

     clearDraft() {
        // Nettoyer le champ de message
        const messageInput = document.getElementById('messageText');
        if (messageInput) {
            messageInput.value = '';
        }

        // Sauvegarder l'état dans le localStorage
        localStorage.removeItem('messageDraft');  // Correction de la chaîne non fermée
        
        // Notification de confirmation
        ToastNotification.show('Brouillon effacé', 'info');
    }

    // Ajouter la sauvegarde automatique du brouillon
    saveDraft() {
        const messageInput = document.getElementById('messageText');
        if (messageInput && messageInput.value.trim()) {
            localStorage.setItem('messageDraft', messageInput.value);
        }
    }

    // Charger le dernier brouillon
    loadDraft() {
        const messageInput = document.getElementById('messageText');
        const savedDraft = localStorage.getItem('messageDraft');
        
        if (messageInput && savedDraft) {
            messageInput.value = savedDraft;
        }
    }

    // Mettre à jour les écouteurs d'événements
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.sidebar-btn').forEach(btn => {
            btn.addEventListener('click', () => this.changeSection(btn.dataset.section));
        });

        // Messaging
        document.getElementById('sendBtn').addEventListener('click', () => this.sendMessage());
        document.getElementById('messageText').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        // Actions
        document.getElementById('archiveBtn').addEventListener('click', () => this.toggleArchive());
        document.getElementById('blockBtn').addEventListener('click', () => this.blockContact());
        document.getElementById('deleteBtn').addEventListener('click', () => this.deleteConversation());

        // Search
        document.getElementById('searchContacts').addEventListener('input', (e) => 
            this.filterContacts(e.target.value.toLowerCase())
        );

        // Ajouter le bouton de nettoyage dans l'interface
        const cleanDraftBtn = document.createElement('button');
        cleanDraftBtn.innerHTML = `
            <i class="fas fa-trash-alt"></i>
            <span class="ml-2">Nettoyer le brouillon</span>
        `;
        cleanDraftBtn.className = 'text-red-500 hover:text-red-600 px-3 py-1 rounded-lg text-sm flex items-center';
        cleanDraftBtn.addEventListener('click', () => this.clearDraft());

        // Sauvegarder automatiquement le brouillon lors de la saisie
        const messageInput = document.getElementById('messageText');
        if (messageInput) {
            messageInput.addEventListener('input', () => {
                this.saveDraft();
            });
        }

        // Charger le brouillon au démarrage
        this.loadDraft();
    }

    changeSection(section) {
        document.querySelectorAll('.sidebar-btn').forEach(btn => 
            btn.classList.remove('active-section')
        );
        document.querySelector(`[data-section="${section}"]`).classList.add('active-section');
        
        this.data.currentSection = section;
        
        switch(section) {
            case 'messages':
                this.showContacts();
                break;
            case 'groups':
                this.showGroups();
                break;
            case 'broadcast':
                this.showBroadcast();
                break;
            case 'archives':
                this.showArchives();
                break;
            case 'new':
                this.showNewContact();
                break;
            case 'logoutBtn':
                this.handleLogout();
                break;
        }
    }

    handleLogout() {
        sessionStorage.removeItem('isAdminLoggedIn');
        window.location.href = '/';
    }

    showContacts() {
        const contactsList = document.getElementById('contactsList');
        const discussionsTitle = document.querySelector('section h2');
        discussionsTitle.textContent = 'Contacts';
        
        contactsList.innerHTML = '';
        
        this.data.contacts
            .filter(contact => !contact.archive)
            .forEach(contact => {
                const contactElement = this.createContactElement(contact);
                contactsList.appendChild(contactElement);
            });
    }

    showGroups() {
        const contactsList = document.getElementById('contactsList');
        const discussionsTitle = document.querySelector('section h2');
        discussionsTitle.textContent = 'Groupes';
        
        contactsList.innerHTML = '';
        
        // Bouton pour créer un nouveau groupe
        const nouveauGroupeBtn = document.createElement('div');
        nouveauGroupeBtn.className = 'p-3   rounded-lg cursor-pointer hover:bg-blue-200 mb-3';
        nouveauGroupeBtn.innerHTML = `
            <div class="flex items-center">
                <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white mr-3">
                    <i class="fas fa-plus"></i>
                </div>
             
            </div>
        `;
        nouveauGroupeBtn.addEventListener('click', () => this.createNewGroup());
        contactsList.appendChild(nouveauGroupeBtn);
        
        // Afficher les groupes existants
        this.data.groupes.forEach(groupe => {
            const groupeElement = this.createGroupElement(groupe);
            contactsList.appendChild(groupeElement);
        });
    }

   showBroadcast() {
    const contactsList = document.getElementById('contactsList');
    const discussionsTitle = document.querySelector('section h2');
    discussionsTitle.textContent = 'Liste de diffusion';
    
    contactsList.innerHTML = `
        <div class="bg-white p-4 rounded-lg shadow">
            <div class="mb-4">
                <h3 class="font-semibold mb-2">Sélectionner les destinataires :</h3>
                <div class="space-y-2 max-h-96 overflow-y-auto">
                    ${this.data.contacts.map(contact => `
                        <label class="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                            <input type="checkbox" 
                                name="contacts" 
                                value="${contact.id}"
                                class="w-4 h-4 mr-3 text-yellow-500">
                            <div class="flex items-center">
                                <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                                    ${contact.avatar}
                                </div>
                                ${contact.nom}
                            </div>
                        </label>
                    `).join('')}
                </div>
            </div>
            <div class="flex justify-between items-center">
                <span id="selectedCount" class="text-sm text-gray-500">0 contact(s) sélectionné(s)</span>
                <button id="selectAllBtn" class="text-sm text-yellow-500 hover:text-yellow-600">
                    Tout sélectionner
                </button>
            </div>
        </div>
    `;

    // Gérer le compteur de sélection et la sélection multiple
    const checkboxes = contactsList.querySelectorAll('input[type="checkbox"]');
    const countSpan = contactsList.querySelector('#selectedCount');
    const selectAllBtn = document.getElementById('selectAllBtn');
    let allSelected = false;

    // Ajouter le gestionnaire pour "Tout sélectionner"
    selectAllBtn.addEventListener('click', () => {
        allSelected = !allSelected;
        checkboxes.forEach(cb => {
            cb.checked = allSelected;
        });
        const count = allSelected ? checkboxes.length : 0;
        countSpan.textContent = `${count} contact(s) sélectionné(s)`;
        selectAllBtn.textContent = allSelected ? 'Tout désélectionner' : 'Tout sélectionner';
    });

    // Gérer les changements individuels
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const selectedCount = [...checkboxes].filter(cb => cb.checked).length;
            countSpan.textContent = `${selectedCount} contact(s) sélectionné(s)`;
            allSelected = selectedCount === checkboxes.length;
            selectAllBtn.textContent = allSelected ? 'Tout désélectionner' : 'Tout sélectionner';
        });
    });

    // Modifier le comportement du bouton d'envoi existant
    document.getElementById('sendBtn').addEventListener('click', () => {
        const message = document.getElementById('messageText').value.trim();
        const selectedContacts = [...checkboxes]
            .filter(cb => cb.checked)
            .map(cb => parseInt(cb.value));

        if (!message) {
            ToastNotification.show('Veuillez écrire un message', 'error');
            return;
        }

        if (selectedContacts.length === 0) {
            ToastNotification.show('Veuillez sélectionner au moins un contact', 'error');
            return;
        }

        // Envoyer le message à tous les contacts sélectionnés
        selectedContacts.forEach(contactId => {
            const contact = this.data.contacts.find(c => c.id === contactId);
            if (contact) {
                contact.messages.push({
                    contenu: message,
                    envoyeur: 'moi',
                    heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                });
            }
        });

        // Sélectionner et afficher le premier contact de la diffusion
        if (selectedContacts.length > 0) {
            const firstContact = this.data.contacts.find(c => c.id === selectedContacts[0]);
            if (firstContact) {
                this.data.currentContact = firstContact;
                this.updateContactInfo(firstContact);
                this.showMessages(firstContact.messages);
                this.changeSection('messages'); // Rediriger vers la section messages
            }
        }

        ToastNotification.show(`Message envoyé à ${selectedContacts.length} contact(s)`, 'success');
        document.getElementById('messageText').value = '';
        checkboxes.forEach(cb => cb.checked = false);
        countSpan.textContent = '0 contact(s) sélectionné(s)';
    });
}


    showArchives() {
        const contactsList = document.getElementById('contactsList');
        const discussionsTitle = document.querySelector('section h2');
        discussionsTitle.textContent = 'Archives';
        
        contactsList.innerHTML = '';
        
        const contactsArchives = this.data.contacts.filter(contact => contact.archive);
        
        if (contactsArchives.length === 0) {
            contactsList.innerHTML = '<p class="text-gray-500 text-center mt-8">Aucune conversation archivée</p>';
            return;
        }
        
        contactsArchives.forEach(contact => {
            const contactElement = this.createContactElement(contact);
            contactsList.appendChild(contactElement);
        });
    }

    showNewContact() {
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
                            >
                    </div>
                    <div class="mb-3">
                        <label class="block text-sm font-medium mb-1">Téléphone</label>
                        <input type="tel" 
                            id="nouveauTel" 
                            pattern="[0-9]*"
                            maxlength="9"
                            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
                            >
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
            const nom = e.target.value.trim();
            
            if (nom.length === 0) {
                nomInput.setCustomValidity('Le nom est requis');
                nomInput.classList.add('border-red-500');
                return;
            }
            
            if (this.data.contacts.some(contact => 
                contact.nom.toLowerCase() === nom.toLowerCase()
            )) {
                nomInput.setCustomValidity('Ce nom existe déjà');
                nomInput.classList.add('border-red-500');
            } else {
                nomInput.setCustomValidity('');
                nomInput.classList.remove('border-red-500');
            }
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const nom = nomInput.value.trim();
            
            if (!nom) {
                ToastNotification.show('Le nom est requis', 'error');
                return;
            }
            
            // Vérifier si le nom existe déjà
            if (this.data.contacts.some(contact => contact.nom.toLowerCase() === nom.toLowerCase())) {
                ToastNotification.show('Ce nom existe déjà', 'error');
                return;
            }

            // Vérifier le format du numéro
            if (telInput.value.trim().length !== 9) {
                ToastNotification.show('Le numéro de téléphone doit contenir 9 chiffres', 'error');
                return;
            }

            // Créer le nouveau contact
            const nouveauContact = new Contact(
                Math.max(...this.data.contacts.map(c => c.id)) + 1,
                nom,
                "offline",
                nom.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2),
                false,
                []
            );

            this.data.contacts.push(nouveauContact);
            ToastNotification.show('Contact ajouté avec succès !', 'success');
            form.reset();
            this.showContacts();
        });
    }

    createContactElement(contact) {
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
                    <h4 class="font-semibold contact-name">${contact.nom}</h4>
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-gray-500">
                            ${contact.telephone || ''}
                        </span>
                        <div class="flex items-center">
                            <span class="inline-block w-2 h-2 rounded-full ${
                                contact.isOnline ? 'bg-green-500' : 'bg-gray-400'
                            } mr-2"></span>
                            <span class="text-sm text-gray-500">${contact.statut}</span>
                        </div>
                    </div>
                </div>
                <div class="flex items-center space-x-2">
                    <span class="text-xs text-gray-500">
                        ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </div>
        `;
        
        div.addEventListener('click', () => this.selectContact(contact));
        div.classList.add('contact-item');
        return div;
    }

    createGroupElement(groupe) {
        const div = document.createElement('div');
        div.className = 'p-3 bg-white border rounded-lg cursor-pointer hover:bg-gray-50 transition duration-200 relative';
        div.setAttribute('data-id', groupe.id); // Ajouter l'attribut data-id
        div.innerHTML = `
            <div class="flex items-center">
                <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white mr-3">
                    ${groupe.avatar}
                </div>
                <div class="flex-1">
                    <h4 class="font-semibold">${groupe.nom}</h4>
                    <p class="text-sm text-gray-500">${groupe.membres.length} membres</p>
                </div>
                <div class="flex space-x-1">
                    <button class="add-member-btn w-6 h-6 bg-blue-500 text-white rounded-full text-xs hover:bg-blue-600" title="Ajouter un membre">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="manage-group-btn w-6 h-6 bg-gray-500 text-white rounded-full text-xs hover:bg-gray-600" title="Gérer le groupe">
                        <i class="fas fa-cog"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Événements pour les boutons du groupe
        div.querySelector('.add-member-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.addMemberToGroup(groupe);
        });
        
        div.querySelector('.manage-group-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.manageGroup(groupe);
        });
        
        div.addEventListener('click', () => this.selectGroup(groupe));
        div.classList.add('group-item'); // Ajout de la classe group-item
        return div;
    }

    selectContact(contact) {
        // Retirer la sélection précédente
        document.querySelectorAll('.contact-item').forEach(item => {
            item.classList.remove('bg-yellow-50', 'border-yellow-500');
        });
        
        // Ajouter la sélection au contact actif
        const selectedContact = document.querySelector(`.contact-item[data-id="${contact.id}"]`);
        if (selectedContact) {
            selectedContact.classList.add('bg-yellow-50', 'border-yellow-500');
        }
        
        this.data.currentContact = contact;
        this.updateContactInfo(contact);
        this.showMessages(contact.messages);
    }

    selectGroup(groupe) {
        // Retirer la sélection précédente
        document.querySelectorAll('.group-item').forEach(item => {
            item.classList.remove('bg-yellow-50', 'border-yellow-500');
        });
        
        // Ajouter l'attribut data-id à l'élément du groupe lors de sa création
        const groupElements = document.querySelectorAll('.group-item');
        groupElements.forEach((element, index) => {
            if (element.textContent.includes(groupe.nom)) {
                element.setAttribute('data-id', groupe.id);
                element.classList.add('bg-yellow-50', 'border-yellow-500');
            }
        });
        
        // Mettre à jour le contact actuel et les informations
        this.data.currentContact = groupe;
        this.updateGroupInfo(groupe);
        this.showMessages(groupe.messages || []); // Ajouter une vérification pour messages
    }

    updateContactInfo(contact) {
        const currentContact = document.getElementById('currentContact');
        currentContact.innerHTML = `
            <div class="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center text-white">
                ${contact.avatar}
            </div>
            <div class="ml-3 flex-1">
                <h3 class="font-semibold">${contact.nom}</h3>
                <p class="text-sm text-gray-500">${contact.telephone || ''}</p>
                <p class="text-sm text-gray-500">${contact.statut}</p>
            </div>
        `;
    }

    updateGroupInfo(groupe) {
        const currentContact = document.getElementById('currentContact');
        currentContact.innerHTML = `
            <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white">
                ${groupe.avatar}
            </div>
            <div class="ml-3">
                <h3 class="font-semibold">${groupe.nom}</h3>
                <p class="text-sm text-gray-500">${groupe.membres.join(', ')}</p>
            </div>
        `;
    }

    showMessages(messages) {
        const messagesList = document.getElementById('messagesList');
        messagesList.innerHTML = '';
        
        messages.forEach(message => {
            const messageDiv = document.createElement('div');
            const isFromMe = message.envoyeur === 'moi';
            
            messageDiv.className = `flex ${isFromMe ? 'justify-end' : 'justify-start'}`;
            messageDiv.innerHTML = `
                <div class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isFromMe 
                        ? 'bg-green-500 text-white' 
                        : 'bg-white text-gray-800'
                }">
                    ${!isFromMe && message.envoyeur !== 'contact' ? 
                        `<div class="text-xs text-gray-500 mb-1">${message.envoyeur}</div>` : ''
                    }
                    <p>${message.contenu}</p>
                    <div class="text-xs ${isFromMe ? 'text-green-100' : 'text-gray-500'} mt-1">
                        ${message.heure}
                    </div>
                </div>
            `;
            
            messagesList.appendChild(messageDiv);
        });
        
        // Faire défiler vers le bas
        document.getElementById('messagesArea').scrollTop = document.getElementById('messagesArea').scrollHeight;
    }

    sendMessage() {
        const messageText = document.getElementById('messageText');
        const contenu = messageText.value.trim();
        
        if (contenu && this.data.currentContact) {
            const nouveauMessage = {
                contenu: contenu,
                envoyeur: 'moi',
                heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
            };
            
            this.data.currentContact.messages.push(nouveauMessage);
            this.showMessages(this.data.currentContact.messages);
            messageText.value = '';
        }
    }

    createNewGroup() {
        // Créer le modal
        const modalHtml = `
            <div id="groupModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div class="bg-white rounded-lg p-6 w-96">
                    <h3 class="text-lg font-semibold mb-4">Créer un nouveau groupe</h3>
                    <form id="nouveauGroupeForm">
                        <div class="mb-4">
                            <label class="block text-sm font-medium mb-1">Nom du groupe</label>
                            <input type="text" id="nomGroupe" 
                                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300" 
                                required>
                        </div>
                        <div class="mb-4">
                            <label class="block text-sm font-medium mb-1">Membres</label>
                            <div class="max-h-40 overflow-y-auto border rounded-lg p-2">
                                ${this.data.contacts.map(contact => `
                                    <label class="flex items-center p-2 hover:bg-gray-50">
                                        <input type="checkbox" value="${contact.nom}" 
                                            class="mr-2 rounded text-green-500">
                                        ${contact.nom}
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                        <div class="flex justify-end space-x-2">
                            <button type="button" id="annulerGroupe" 
                                class="px-4 py-2 border rounded-lg hover:bg-gray-50">
                                Annuler
                            </button>
                            <button type="submit" 
                                class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                                Créer
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Ajouter le modal au DOM
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Récupérer les éléments
        const modal = document.getElementById('groupModal');
        const form = document.getElementById('nouveauGroupeForm');
        const annulerBtn = document.getElementById('annulerGroupe');

        // Gestionnaire pour fermer le modal
        annulerBtn.addEventListener('click', () => {
            modal.remove();
        });

        // Gestionnaire de soumission du formulaire
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nom = document.getElementById('nomGroupe').value.trim();
            const membresSelectionnes = [...form.querySelectorAll('input[type="checkbox"]:checked')]
                .map(input => input.value);

            if (nom) {
                const initiales = nom.split(' ')
                    .map(word => word[0])
                    .join('')
                    .toUpperCase()
                    .substring(0, 2);

                const nouveauGroupe = new Group(
                    this.data.groupes.length + 1,
                    nom,
                    ['Moi', ...membresSelectionnes],
                    initiales
                );

                this.data.groupes.push(nouveauGroupe);
                this.showGroups();
                ToastNotification.show(`Groupe "${nom}" créé avec succès !`, 'success');
                modal.remove();
            }
        });
    }

    addMemberToGroup(groupe) {
        const contactsDisponibles = this.data.contacts.filter(contact => 
            !groupe.membres.includes(contact.nom)
        );

        const modalHtml = `
            <div id="addMemberModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div class="bg-white rounded-lg p-6 w-96">
                    <h3 class="text-lg font-semibold mb-4">Ajouter des membres</h3>
                    <form id="ajoutMembreForm">
                        <div class="mb-4">
                            <label class="block text-sm font-medium mb-1">Sélectionner des contacts</label>
                            <div class="max-h-40 overflow-y-auto border rounded-lg p-2">
                                ${contactsDisponibles.map(contact => `
                                    <label class="flex items-center p-2 hover:bg-gray-50">
                                        <input type="checkbox" name="contacts" value="${contact.nom}" 
                                            class="mr-2 text-yellow-500">
                                        <span class="flex items-center">
                                            <span class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                                                ${contact.avatar}
                                            </span>
                                            ${contact.nom}
                                        </span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                        <div class="flex justify-between items-center mb-4">
                            <span id="selectedCount" class="text-sm text-gray-500">0 membre(s) sélectionné(s)</span>
                            <button type="button" id="selectAllBtn" 
                                class="text-sm text-yellow-500 hover:text-yellow-600">
                                Tout sélectionner
                            </button>
                        </div>
                        <div class="flex justify-end space-x-2">
                            <button type="button" id="annulerAjout" 
                                class="px-4 py-2 border rounded-lg hover:bg-gray-50">
                                Annuler
                            </button>
                            <button type="submit" 
                                class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                                Ajouter
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);

        const modal = document.getElementById('addMemberModal');
        const form = document.getElementById('ajoutMembreForm');
        const countSpan = modal.querySelector('#selectedCount');
        const selectAllBtn = modal.querySelector('#selectAllBtn');
        const checkboxes = modal.querySelectorAll('input[type="checkbox"]');
        let allSelected = false;

        // Gérer la sélection multiple
        selectAllBtn.addEventListener('click', () => {
            allSelected = !allSelected;
            checkboxes.forEach(cb => cb.checked = allSelected);
            updateSelectedCount();
        });

        checkboxes.forEach(cb => {
            cb.addEventListener('change', updateSelectedCount);
        });

        function updateSelectedCount() {
            const count = [...checkboxes].filter(cb => cb.checked).length;
            countSpan.textContent = `${count} membre(s) sélectionné(s)`;
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const selectedMembers = [...checkboxes]
                .filter(cb => cb.checked)
                .map(cb => cb.value);

            if (selectedMembers.length > 0) {
                selectedMembers.forEach(member => {
                    groupe.membres.push(member);
                });

                groupe.messages.push({
                    contenu: `${selectedMembers.join(', ')} ont été ajoutés au groupe`,
                    envoyeur: 'Système',
                    heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                });

                this.showGroups();
                ToastNotification.show(`${selectedMembers.length} membre(s) ajouté(s) au groupe`, 'success');
                modal.remove();
            } else {
                ToastNotification.show('Veuillez sélectionner au moins un membre', 'error');
            }
        });

        document.getElementById('annulerAjout').addEventListener('click', () => modal.remove());
    }

    manageGroup(groupe) {
        const modalHtml = `
            <div id="gererGroupeModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div class="bg-white rounded-lg p-6 w-96">
                    <h3 class="text-lg font-semibold mb-4">Gérer le groupe "${groupe.nom}"</h3>
                    <div class="space-y-3">
                        <button id="voirMembres" 
                            class="w-full px-4 py-2 text-left border rounded-lg hover:bg-gray-50">
                            1. Voir les membres
                        </button>
                        <button id="supprimerMembre" 
                            class="w-full px-4 py-2 text-left border rounded-lg hover:bg-gray-50">
                            2. Supprimer un membre
                        </button>
                        <button id="renommerGroupe" 
                            class="w-full px-4 py-2 text-left border rounded-lg hover:bg-gray-50">
                            3. Renommer le groupe
                        </button>
                    </div>
                    <div class="flex justify-end mt-4">
                        <button id="fermerGestion" 
                            class="px-4 py-2 border rounded-lg hover:bg-gray-50">
                            Fermer
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);

        const modal = document.getElementById('gererGroupeModal');
        const fermerBtn = document.getElementById('fermerGestion');

        fermerBtn.addEventListener('click', () => {
            modal.remove();
        });

        document.getElementById('voirMembres').addEventListener('click', () => {
            this.showGroupMembers(groupe);
            modal.remove();
        });

        document.getElementById('supprimerMembre').addEventListener('click', () => {
            this.removeMemberFromGroup(groupe);
            modal.remove();
        });

        document.getElementById('renommerGroupe').addEventListener('click', () => {
            this.renameGroup(groupe);
            modal.remove();
        });
    }

    showGroupMembers(groupe) {
        const modalHtml = `
            <div id="membresModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div class="bg-white rounded-lg p-6 w-96">
                    <h3 class="text-lg font-semibold mb-4">Membres du groupe "${groupe.nom}"</h3>
                    <div class="max-h-60 overflow-y-auto border rounded-lg p-2">
                        ${groupe.membres.map(membre => `
                            <div class="p-2 hover:bg-gray-50 flex items-center justify-between">
                                <div class="flex items-center">
                                    <span class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white mr-2">
                                        ${membre.nom.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                                    </span>
                                    <span>${membre.nom}</span>
                                </div>
                                <span class="text-xs px-2 py-1 rounded-full border
                                    ${membre.role === 'admin' ? 'border-yellow-500 text-yellow-500' : 'border-gray-300 text-gray-500'}">
                                    ${membre.role}
                                </span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="flex justify-end mt-4">
                        <button id="fermerMembres" 
                            class="px-4 py-2 border rounded-lg hover:bg-gray-50">
                            Fermer
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        const modal = document.getElementById('membresModal');
        document.getElementById('fermerMembres').addEventListener('click', () => modal.remove());
    }

    removeMemberFromGroup(groupe) {
        // Vérifier si l'utilisateur est admin
        if (!groupe.isAdmin('Moi')) {
            ToastNotification.show('Seuls les administrateurs peuvent retirer des membres', 'error');
            return;
        }

        // Filtrer les membres disponibles (exclure l'utilisateur actuel et les admins uniques)
        const membresDisponibles = groupe.membres
            .filter(membre => membre.nom !== 'Moi')
            .filter(membre => 
                membre.role !== 'admin' || 
                groupe.membres.filter(m => m.role === 'admin').length > 1
            );

        if (membresDisponibles.length === 0) {
            ToastNotification.show('Aucun membre ne peut être retiré', 'error');
            return;
        }

        // Afficher le modal de suppression
        const modalHtml = `
            <div id="supprimerMembreModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div class="bg-white rounded-lg p-6 w-96">
                    <h3 class="text-lg font-semibold mb-4">Retirer un membre</h3>
                    <form id="supprimerMembreForm">
                        <div class="mb-4">
                            <div class="max-h-60 overflow-y-auto border rounded-lg p-2">
                                ${membresDisponibles.map(membre => `
                                    <div class="flex items-center p-2 hover:bg-gray-50">
                                        <label class="flex items-center">
                                            <input type="radio" name="membre" value="${membre.nom}" 
                                                class="mr-2 text-red-500">
                                            <span>${membre.nom}</span>
                                        </label>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        <div class="flex justify-end space-x-2">
                            <button type="button" id="annulerSuppression" 
                                class="px-4 py-2 border rounded-lg hover:bg-gray-50">
                                Annuler
                            </button>
                            <button type="submit" 
                                class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                                Retirer
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);

        const modal = document.getElementById('supprimerMembreModal');
        const form = document.getElementById('supprimerMembreForm');

        // Gérer la soumission du formulaire
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const selectedMembre = form.querySelector('input[name="membre"]:checked');
            
            if (selectedMembre) {
                const membreNom = selectedMembre.value;
                const index = groupe.membres.findIndex(m => m.nom === membreNom);
                
                if (index !== -1) {
                    groupe.membres.splice(index, 1);
                    groupe.messages.push({
                        contenu: `${membreNom} a été retiré du groupe par un administrateur`,
                        envoyeur: 'Système',
                        heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                    });
                    
                    this.showGroups();
                    ToastNotification.show(`${membreNom} a été retiré du groupe`, 'info');
                    modal.remove();
                }
            }
        });

        // Fermer le modal
        document.getElementById('annulerSuppression').addEventListener('click', () => modal.remove());
    }

    renameGroup(groupe) {
        const modalHtml = `
            <div id="renommerModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div class="bg-white rounded-lg p-6 w-96">
                    <h3 class="text-lg font-semibold mb-4">Renommer le groupe</h3>
                    <form id="renommerForm">
                        <div class="mb-4">
                            <label class="block text-sm font-medium mb-1">Nouveau nom</label>
                            <input type="text" id="nouveauNom" 
                                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                                value="${groupe.nom}" required>
                        </div>
                        <div class="flex justify-end space-x-2">
                            <button type="button" id="annulerRenommer" 
                                class="px-4 py-2 border rounded-lg hover:bg-gray-50">
                                Annuler
                            </button>
                            <button type="submit" 
                                class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                                Renommer
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);

        const modal = document.getElementById('renommerModal');
        const form = document.getElementById('renommerForm');
        const annulerBtn = document.getElementById('annulerRenommer');

        annulerBtn.addEventListener('click', () => modal.remove());

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const nouveauNom = document.getElementById('nouveauNom').value.trim();
            
            if (nouveauNom) {
                const ancienNom = groupe.nom;
                groupe.nom = nouveauNom;
                groupe.avatar = nouveauNom.split(' ')
                    .map(word => word[0])
                    .join('')
                    .toUpperCase()
                    .substring(0, 2);
                
                groupe.messages.push({
                    contenu: `Le groupe "${ancienNom}" a été renommé en "${nouveauNom}"`,
                    envoyeur: 'Système',
                    heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                });
                
                this.showGroups();
                ToastNotification.show(`Groupe renommé en "${nouveauNom}"`, 'success');
                modal.remove();
            }
        });
    }

    filterContacts(terme) {
        const contactsList = document.getElementById('contactsList');
        contactsList.innerHTML = '';

        // Si * est saisi, afficher tous les contacts par ordre alphabétique
        if (terme === "*") {
            const sortedContacts = this.data.contacts
                .filter(contact => !contact.archive)
                .sort((a, b) => a.nom.localeCompare(b.nom));
                
            sortedContacts.forEach(contact => {
                const contactElement = this.createContactElement(contact);
                contactsList.appendChild(contactElement);
            });
            return;
        }

        // Filtrer les contacts par nom ou numéro de téléphone
        const filteredContacts = this.data.contacts.filter(contact => {
            const nomMatch = contact.nom.toLowerCase().includes(terme.toLowerCase());
            const telMatch = contact.telephone && contact.telephone.replace(/\s/g, '').includes(terme);
            return (nomMatch || telMatch) && !contact.archive;
        });

        // Afficher les contacts filtered
        filteredContacts.forEach(contact => {
            const contactElement = this.createContactElement(contact);
            contactsList.appendChild(contactElement);
        });
    }

    toggleArchive() {
        if (!this.data.currentContact) return;

        // Inverser l'état d'archive
        this.data.currentContact.archive = !this.data.currentContact.archive;
        
        // Mettre à jour l'apparence du bouton
        const btn = document.getElementById('archiveBtn');
        const icon = btn.querySelector('i');
        
        if (this.data.currentContact.archive) {
            btn.classList.remove('border-gray-500');
            btn.classList.add('border-blue-500');
            icon.classList.remove('text-gray-500');
            icon.classList.add('text-blue-500');
        } else {
            btn.classList.remove('border-blue-500');
            btn.classList.add('border-gray-500');
            icon.classList.remove('text-blue-500');
            icon.classList.add('text-gray-500');
        }

        // Notification
        ToastNotification.show(
            `Conversation ${this.data.currentContact.archive ? 'archivée' : 'désarchivée'}`,
            'info'
        );

        // Rafraîchir l'affichage
        if (this.data.currentSection === 'archives') {
            this.showArchives();
        } else {
            this.showContacts();
        }
    }

    blockContact() {
        if (this.data.currentContact) {
            const contactNom = this.data.currentContact.nom;
            this.data.currentContact.bloque = true;
            ToastNotification.show(`${contactNom} a été bloqué`, 'warning');
            // Mettre à jour l'interface pour refléter le statut bloqué
            this.updateContactInfo(this.data.currentContact);
        }
    }

    deleteConversation() {
        if (this.data.currentContact) {
            const contactNom = this.data.currentContact.nom;
            this.data.currentContact.messages = [];
            this.showMessages([]);
            ToastNotification.show(`Conversation avec ${contactNom} supprimée`, 'warning');
        }
    }
}

// Export the initialization function
export function initializeApp() {
    const app = new ChatApp();
    app.initialize();
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    const app = new ChatApp();
    app.initialize();
    ConnectionManager.checkConnection();
    ThemeManager.initTheme();
});
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('authToken');
    window.location.href = "index.html";
});