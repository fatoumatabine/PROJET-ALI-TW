import { appData } from './app-data.js';
f
function changerSection(section) {
    document.querySelectorAll('.sidebar-btn').forEach(btn => {
        btn.classList.remove('active-section');
    });
    document.querySelector(`[data-section="${section}"]`).classList.add('active-section');
    
    appData.currentSection = section;
    
    switch(section) {
        case 'messages': afficherContacts(); break;
        case 'groups': afficherGroupes(); break;
        case 'broadcast': afficherDiffusion(); break;
        case 'archives': afficherArchives(); break;
        case 'new': afficherNouveauContact(); break;
    }
}

// Afficher les contacts
function afficherContacts() {
    const contactsList = document.getElementById('contactsList');
    contactsList.innerHTML = '';
    
    appData.contacts
        .filter(contact => !contact.archive)
        .forEach(contact => {
            contactsList.appendChild(creerElementContact(contact));
        });
}

// Envoyer un message
function envoyerMessage() {
    const messageText = document.getElementById('messageText');
    const contenu = messageText.value.trim();
    
    if (!contenu || !appData.currentContact) return;

    const nouveauMessage = {
        contenu: contenu,
        envoyeur: 'moi',
        heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };

    appData.currentContact.messages.push(nouveauMessage);
    afficherMessages(appData.currentContact.messages);
    messageText.value = '';
    showNotification('Message envoyé', 'success');
}
function filtrerContacts(terme) {
    const elements = document.querySelectorAll('#contactsList > div');
    
    if (terme === "*") {
        // Afficher tous par ordre alphabétique
        appData.contacts
            .sort((a, b) => a.nom.localeCompare(b.nom))
            .forEach(contact => {
                const element = creerElementContact(contact);
                contactsList.appendChild(element);
            });
        return;
    }

    elements.forEach(element => {
        const nom = element.querySelector('h4')?.textContent.toLowerCase() || '';
        const telephone = element.dataset.telephone || '';
        
        if (nom.includes(terme) || telephone.includes(terme)) {
            element.style.display = 'block';
        } else {
            element.style.display = 'none';
        }
    });
}
function nettoyerBrouillons() {
    if (!confirm("Voulez-vous vraiment supprimer tous les brouillons ?")) return;
    
    appData.contacts.forEach(contact => {
        contact.messages = contact.messages.filter(msg => !msg.brouillon);
    });
    
    appData.groupes.forEach(groupe => {
        groupe.messages = groupe.messages.filter(msg => !msg.brouillon);
    });
    
    showNotification("Brouillons nettoyés", "success");
    if (appData.currentContact) {
        afficherMessages(appData.currentContact.messages);
    }
}