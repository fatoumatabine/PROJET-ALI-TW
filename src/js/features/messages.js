import { appData } from '../app-data.js';
import { showNotification } from '../utils.js';
import { afficherMessages } from '../ui/messages-ui.js';

export function envoyerMessage() {
    const messageInput = document.getElementById('messageText');
    const contenu = messageInput.value.trim();
    
    if (!contenu) {
        showNotification("Veuillez écrire un message", "error");
        return;
    }
    
    if (!appData.currentContact) {
        showNotification("Aucun contact sélectionné", "error");
        return;
    }

    // Vérification si le contact est bloqué
    if (appData.currentContact.bloque) {
        showNotification("Ce contact est bloqué - envoi impossible", "error");
        return;
    }

    // Création du message
    const nouveauMessage = {
        contenu: contenu,
        envoyeur: 'moi',
        date: new Date().toLocaleDateString('fr-FR'),
        heure: new Date().toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        })
    };

    try {
        // Ajout du message à la conversation
        appData.currentContact.messages.push(nouveauMessage);
        
        // Notification
        if (appData.currentContact.membres) {
            showNotification(`Message envoyé au groupe ${appData.currentContact.nom}`, "success");
        } else {
            showNotification(`Message envoyé à ${appData.currentContact.nom}`, "success");
        }

        // Réinitialisation du champ
        messageInput.value = '';
        
        // Rafraîchir l'affichage
        afficherMessages(appData.currentContact.messages);
    } catch (error) {
        console.error("Erreur d'envoi:", error);
        showNotification("Échec de l'envoi du message", "error");
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