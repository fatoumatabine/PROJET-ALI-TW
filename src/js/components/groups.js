import { appData } from '../data/appData.js';
import { showNotification } from '../utils/notifications.js';

// Export de la fonction principale d'affichage des groupes
export function afficherGroupes() {
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
    nouveauGroupeBtn.addEventListener('click', creerNouveauGroupe);
    contactsList.appendChild(nouveauGroupeBtn);
    
    // Afficher les groupes existants
    appData.groupes.forEach(groupe => {
        const groupeElement = creerElementGroupe(groupe);
        contactsList.appendChild(groupeElement);
    });
}

// Export des autres fonctions nécessaires
export {
    creerNouveauGroupe,
    ajouterMembreGroupe,
    gererGroupe,
    afficherMembresGroupe,
    supprimerMembreGroupe,
    renommerGroupe
};

// Fonction pour créer l'élément visuel d'un groupe
export function creerElementGroupe(groupe) {
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
        ajouterMembreGroupe(groupe);
    });
    
    div.querySelector('.manage-group-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        gererGroupe(groupe);
    });
    
    return div;
}

// ...rest of your existing functions...