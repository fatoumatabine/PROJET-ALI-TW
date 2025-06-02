import { appData, showNotification } from './app-data.js';

export function gererMembresGroupe(groupe) {
    const modalHtml = `
        <div id="gererMembresModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
                <h3 class="text-lg font-semibold mb-4">Gérer les membres de "${groupe.nom}"</h3>
                <div class="space-y-3">
                    ${groupe.membres.map(membre => `
                        <div class="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <div class="flex items-center">
                                <span class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white mr-2">
                                    ${membre.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                                </span>
                                <span>${membre}</span>
                            </div>
                            <div class="flex space-x-2">
                                ${membre !== 'Moi' ? `
                                    <button class="btn-promote w-8 h-8 rounded-full flex items-center justify-center
                                        ${groupe.admins && groupe.admins.includes(membre) ? 'bg-yellow-500 text-white' : 'bg-gray-200'}"
                                        data-member="${membre}">
                                        👑
                                    </button>
                                    <button class="btn-remove w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center"
                                        data-member="${membre}">
                                        ✕
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="flex justify-end mt-6">
                    <button id="fermerGererMembres" class="px-4 py-2 border rounded-lg hover:bg-gray-50">
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = document.getElementById('gererMembresModal');

    document.getElementById('fermerGererMembres').addEventListener('click', () => modal.remove());

    document.querySelectorAll('.btn-promote').forEach(btn => {
        btn.addEventListener('click', function() {
            const membre = this.dataset.member;
            changerStatutMembre(groupe, membre);
            modal.remove();
            gererMembresGroupe(groupe);
        });
    });

    document.querySelectorAll('.btn-remove').forEach(btn => {
        btn.addEventListener('click', function() {
            const membre = this.dataset.member;
            retirerMembreGroupe(groupe, membre);
            modal.remove();
            gererMembresGroupe(groupe);
        });
    });
}

export function changerStatutMembre(groupe, membreNom) {
    if (!estAdminGroupe(groupe)) {
        showNotification("Action réservée aux admins", "error");
        return;
    }

    if (!groupe.admins) {
        groupe.admins = ["Moi"];
    }

    if (groupe.admins.includes(membreNom)) {
        groupe.admins = groupe.admins.filter(admin => admin !== membreNom);
        showNotification(`${membreNom} n'est plus administrateur`, "info");
    } else {
        groupe.admins.push(membreNom);
        showNotification(`${membreNom} est maintenant administrateur`, "success");
    }
}

export function retirerMembreGroupe(groupe, membreNom) {
    if (!estAdminGroupe(groupe)) {
        showNotification("Seul un admin peut retirer un membre", "error");
        return;
    }

    if (groupe.membres.length <= 1) {
        showNotification('Impossible de supprimer le dernier membre du groupe.', 'error');
        return;
    }

    const index = groupe.membres.indexOf(membreNom);
    if (index !== -1) {
        groupe.membres.splice(index, 1);
        
        if (groupe.admins && groupe.admins.includes(membreNom)) {
            groupe.admins = groupe.admins.filter(admin => admin !== membreNom);
        }

        groupe.messages.push({
            contenu: `${membreNom} a été retiré du groupe`,
            envoyeur: 'Système',
            heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        });

        showNotification(`${membreNom} a été retiré du groupe`, 'info');
    }
}

export function estAdminGroupe(groupe) {
    if (!groupe.admins) {
        groupe.admins = ["Moi"];
    }
    return groupe.admins.includes("Moi");
}

export function nettoyerBrouillons() {
    if (!confirm("Voulez-vous vraiment supprimer toutes les conversations archivées ? Cette action est irréversible.")) {
        return;
    }

    let count = 0;
    
    appData.contacts.forEach(contact => {
        if (contact.archive) {
            contact.messages = [];
            count++;
        }
    });

    appData.groupes.forEach(groupe => {
        if (groupe.archive) {
            groupe.messages = [];
            count++;
        }
    });

    showNotification(`${count} conversations archivées ont été nettoyées`, "success");
}