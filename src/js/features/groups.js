import { appData } from '../app-data.js';
import { showNotification, estAdminGroupe } from '../utils.js';
import { creerElementGroupe } from '../ui/groups-ui.js';

export function afficherGroupes() {
    const contactsList = document.getElementById('contactsList');
    const discussionsTitle = document.querySelector('section h2');
    discussionsTitle.textContent = 'Groupes';
    
    contactsList.innerHTML = '';
    
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
    nouveauGroupeBtn.addEventListener('click', creerNouveauGroupe);
    contactsList.appendChild(nouveauGroupeBtn);
    
    appData.groupes.forEach(groupe => {
        contactsList.appendChild(creerElementGroupe(groupe));
    });
}

export function creerNouveauGroupe() {
    // Implémentation simplifiée pour l'exemple
    const nouveauGroupe = {
        id: appData.groupes.length + 1,
        nom: `Groupe ${appData.groupes.length + 1}`,
        membres: ["Moi"],
        admins: ["Moi"],
        avatar: "GP",
        messages: []
    };
    
    appData.groupes.push(nouveauGroupe);
    afficherGroupes();
    showNotification(`Groupe "${nouveauGroupe.nom}" créé avec succès`, 'success');
}

export function retirerMembreGroupe(groupe, membreNom) {
    if (!estAdminGroupe(groupe)) {
        showNotification("Seul un admin peut retirer un membre", "error");
        return;
    }

    const index = groupe.membres.indexOf(membreNom);
    if (index !== -1) {
        groupe.membres.splice(index, 1);
        groupe.messages.push({
            contenu: `${membreNom} a été retiré du groupe par l'admin`,
            envoyeur: 'Système',
            heure: new Date().toLocaleTimeString('fr-FR', { 
                hour: '2-digit', 
                minute: '2-digit' 
            })
        });
        showNotification(`${membreNom} retiré du groupe`, "success");
    }
}

export function changerStatutMembre(groupe, membreNom, estAdmin) {
    if (!estAdminGroupe(groupe)) {
        showNotification("Action réservée aux admins", "error");
        return;
    }

    if (estAdmin) {
        if (!groupe.admins.includes(membreNom)) {
            groupe.admins.push(membreNom);
            showNotification(`${membreNom} est maintenant admin`, "success");
        }
    } else {
        groupe.admins = groupe.admins.filter(admin => admin !== membreNom);
        showNotification(`${membreNom} n'est plus admin`, "info");
    }
}