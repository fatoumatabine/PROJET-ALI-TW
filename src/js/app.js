// Base classes for data models
class Contact {
    constructor(id, nom, statut, avatar, archive = false, isOnline = false) {
        this.id = id;
        this.nom = nom; 
        this.statut = statut;
        this.avatar = avatar;
        this.archive = archive;
        this.isOnline = isOnline;
        this.messages = [];
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

    static show(message, type = 'success') {
        const colors = {
            success: 'linear-gradient(to right, #00b09b, #96c93d)',
            error: 'linear-gradient(to right, #ff5f6d, #ffc371)',
            warning: 'linear-gradient(to right, #f7b733, #fc4a1a)',
            info: 'linear-gradient(to right, #2193b0, #6dd5ed)'
        };

        Toastify({
            text: message,
            duration: 3000,
            gravity: "top",
            position: "right",
            style: { background: colors[type] },
            close: true
        }).showToast();
    }
}

// Main Application Class
class ChatApp {
    constructor() {
        this.data = {
            contacts: [
                new Contact(1, "Malick sylla", "offline", "MS", false, true),
                new Contact(2, "Astou mbow", "absent", "BD"),
                new Contact(3, "yaye teden faye", "en ligne", "ES", false, true),
                new Contact(4, "binetou Sylla", "en ligne", "AS")
            ],
            groupes: [
                new Group(1, "Famille", ["malick sylla", "elisabet seck", "Moi"], "FA")
            ],
            currentSection: "messages",
            currentContact: null,
            listeDiffusion: []
        };
    }

    initialize() {
        ToastNotification.addCSS();
        this.setupEventListeners();
        this.showContacts();
        document.querySelector('.sidebar-btn[data-section="messages"]').classList.add('active-section');
    }

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
    }

    changeSection(section) {
        document.querySelectorAll('.sidebar-btn').forEach(btn => 
            btn.classList.remove('active-section')
        );
        document.querySelector(`[data-section="${section}"]`).classList.add('active-section');
        
        this.data.currentSection = section;
        
        switch(section) {
            case 'messages': this.showContacts(); break;
            case 'groups': this.showGroups(); break;
            case 'broadcast': this.showBroadcast(); break;
            case 'archives': this.showArchives(); break;
            case 'new': this.showNewContact(); break;
        }
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
        nouveauGroupeBtn.className = 'p-3 bg-blue-100 border-2 border-blue-300 rounded-lg cursor-pointer hover:bg-blue-200 mb-3';
        nouveauGroupeBtn.innerHTML = `
            <div class="flex items-center">
                <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white mr-3">
                    <i class="fas fa-plus"></i>
                </div>
                <div>
                    <h4 class="font-semibold text-blue-700">Nouveau Groupe</h4>
                    <p class="text-sm text-blue-600">Créer un nouveau groupe</p>
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
                <form id="diffusionForm">
                    <div class="mb-4">
                        <input type="text" 
                            id="messageText" 
                            class="w-full p-3 border rounded-lg" 
                            placeholder="Écrivez votre message...">
                    </div>

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
                        <span id="selectedCount" class="text-sm text-gray-500">
                            0 contact(s) sélectionné(s)
                        </span>
                        <button type="submit" 
                            class="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                            Envoyer
                        </button>
                    </div>
                </form>
            </div>
        `;

        // Gérer le compteur de sélection
        const checkboxes = contactsList.querySelectorAll('input[type="checkbox"]');
        const countSpan = contactsList.querySelector('#selectedCount');
        
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const count = [...checkboxes].filter(cb => cb.checked).length;
                countSpan.textContent = `${count} contact(s) sélectionné(s)`;
            });
        });

        // Gérer l'envoi du message
        document.getElementById('diffusionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            
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
            const nomExiste = this.data.contacts.some(contact => 
                contact.nom.toLowerCase() === e.target.value.toLowerCase()
            );
            
            if (nomExiste) {
                nomInput.setCustomValidity('Ce nom existe déjà');
                ToastNotification.show('Ce nom existe déjà', 'error');
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
            if (this.data.contacts.some(contact => contact.nom.toLowerCase() === nom.toLowerCase())) {
                ToastNotification.show('Ce nom existe déjà', 'error');
                return;
            }

            // Vérifier le format du numéro
            if (tel.length !== 9 || !/^\d+$/.test(tel)) {
                ToastNotification.show('Format du numéro invalide', 'error');
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
                    <h4 class="font-semibold">${contact.nom}</h4>
                    <div class="flex items-center">
                        <span class="inline-block w-2 h-2 rounded-full ${
                            contact.isOnline ? 'bg-green-500' : 'bg-gray-400'
                        } mr-2"></span>
                        <span class="text-sm text-gray-500">${
                            contact.isOnline ? 'En ligne' : 'Hors ligne'
                        }</span>
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
        return div;
    }

    createGroupElement(groupe) {
        const div = document.createElement('div');
        div.className = 'p-3 bg-white border rounded-lg cursor-pointer hover:bg-gray-50 transition duration-200 relative';
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
        return div;
    }

    selectContact(contact) {
        this.data.currentContact = contact;
        this.updateContactInfo(contact);
        this.showMessages(contact.messages);
    }

    selectGroup(groupe) {
        this.data.currentContact = groupe;
        this.updateGroupInfo(groupe);
        this.showMessages(groupe.messages);
    }

    updateContactInfo(contact) {
        const currentContact = document.getElementById('currentContact');
        currentContact.innerHTML = `
            <div class="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center text-white">
                ${contact.avatar}
            </div>
            <div class="ml-3">
                <h3 class="font-semibold">${contact.nom}</h3>
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
        
        if (contactsDisponibles.length === 0) {
            ToastNotification.show('Tous vos contacts sont déjà membres de ce groupe.', 'error');
            return;
        }

        const modalHtml = `
            <div id="addMemberModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div class="bg-white rounded-lg p-6 w-96">
                    <h3 class="text-lg font-semibold mb-4">Ajouter un membre</h3>
                    <form id="ajoutMembreForm">
                        <div class="mb-4">
                            <label class="block text-sm font-medium mb-1">Contacts disponibles</label>
                            <div class="max-h-40 overflow-y-auto border rounded-lg p-2">
                                ${contactsDisponibles.map(contact => `
                                    <label class="flex items-center p-2 hover:bg-gray-50">
                                        <input type="radio" name="contact" value="${contact.nom}" 
                                            class="mr-2 text-green-500">
                                        ${contact.nom}
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                        <div class="flex justify-end space-x-2">
                            <button type="button" id="annulerAjout" 
                                class="px-4 py-2 border rounded-lg hover:bg-gray-50">
                                Annuler
                            </button>
                            <button type="submit" 
                                class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
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
        const annulerBtn = document.getElementById('annulerAjout');

        annulerBtn.addEventListener('click', () => modal.remove());

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const selectedContact = form.querySelector('input[name="contact"]:checked');
            
            if (selectedContact) {
                const contactNom = selectedContact.value;
                groupe.membres.push(contactNom);
                
                groupe.messages.push({
                    contenu: `${contactNom} a été ajouté au groupe`,
                    envoyeur: 'Système',
                    heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                });
                
                this.showGroups();
                ToastNotification.show(`${contactNom} a été ajouté au groupe "${groupe.nom}"`, 'success');
                modal.remove();
            }
        });
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

        fermerBtn.addEventListener('click', () => modal.remove());

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
                            <div class="p-2 hover:bg-gray-50 flex items-center">
                                <span class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white mr-2">
                                    ${membre.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                                </span>
                                ${membre}
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
        if (groupe.membres.length <= 1) {
            ToastNotification.show('Impossible de supprimer le dernier membre du groupe.', 'error');
            return;
        }

        const membresDisponibles = groupe.membres.filter(membre => membre !== 'Moi');

        const modalHtml = `
            <div id="supprimerMembreModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div class="bg-white rounded-lg p-6 w-96">
                    <h3 class="text-lg font-semibold mb-4">Supprimer un membre</h3>
                    <form id="supprimerMembreForm">
                        <div class="mb-4">
                            <label class="block text-sm font-medium mb-1">Choisir un membre</label>
                            <div class="max-h-40 overflow-y-auto border rounded-lg p-2">
                                ${membresDisponibles.map(membre => `
                                    <label class="flex items-center p-2 hover:bg-gray-50">
                                        <input type="radio" name="membre" value="${membre}" 
                                            class="mr-2 text-red-500">
                                        ${membre}
                                    </label>
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
                                Supprimer
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);

        const modal = document.getElementById('supprimerMembreModal');
        const form = document.getElementById('supprimerMembreForm');
        const annulerBtn = document.getElementById('annulerSuppression');

        annulerBtn.addEventListener('click', () => modal.remove());

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const selectedMembre = form.querySelector('input[name="membre"]:checked');
            
            if (selectedMembre) {
                const membreNom = selectedMembre.value;
                const index = groupe.membres.indexOf(membreNom);
                
                if (index !== -1) {
                    groupe.membres.splice(index, 1);
                    groupe.messages.push({
                        contenu: `${membreNom} a quitté le groupe`,
                        envoyeur: 'Système',
                        heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                    });
                    
                    this.showGroups();
                    ToastNotification.show(`${membreNom} a été retiré du groupe`, 'info');
                    modal.remove();
                }
            }
        });
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
        const items = document.querySelectorAll('#contactsList > div');
        
        items.forEach(item => {
            const nom = item.querySelector('h4');
            if (nom) {
                const texte = nom.textContent.toLowerCase();
                if (texte.includes(terme)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            }
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

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    const app = new ChatApp();
    app.initialize();
});