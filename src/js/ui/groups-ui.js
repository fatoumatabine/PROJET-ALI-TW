import { appData } from '../app-data.js';
import { selectionnerGroupe } from '../features/groups.js';
import { ajouterMembreGroupe, gererGroupe } from '../features/groups.js';

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
    
    div.querySelector('.add-member-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        ajouterMembreGroupe(groupe);
    });
    
    div.querySelector('.manage-group-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        gererGroupe(groupe);
    });
    
    div.addEventListener('click', () => selectionnerGroupe(groupe));
    return div;
}

export function mettreAJourInfoGroupe(groupe) {
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