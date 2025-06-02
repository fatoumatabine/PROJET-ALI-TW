import { appData } from '../app-data.js';
import { selectionnerContact } from '../features/contacts.js';

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

export function mettreAJourInfoContact(contact) {
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