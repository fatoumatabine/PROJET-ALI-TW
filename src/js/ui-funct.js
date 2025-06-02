// Créer un élément de contact
function creerElementContact(contact) {
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
        </div>
    `;
    div.addEventListener('click', () => selectionnerContact(contact));
    return div;
}

// Créer un élément de groupe
function creerElementGroupe(groupe) {
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
        </div>
    `;
    div.addEventListener('click', () => selectionnerGroupe(groupe));
    return div;
}

// Afficher les messages
function afficherMessages(messages) {
    const messagesList = document.getElementById('messagesList');
    messagesList.innerHTML = '';
    
    if (messages.length === 0) {
        messagesList.innerHTML = `
            <div class="flex items-center justify-center h-full text-gray-500">
                <div class="text-center">
                    <i class="fas fa-comments text-4xl mb-4"></i>
                    <p>Aucun message pour le moment</p>
                </div>
            </div>
        `;
        return;
    }

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