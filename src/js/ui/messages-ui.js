import { appData } from '../app-data.js';

export function afficherMessages(messages) {
    const messagesList = document.getElementById('messagesList');
    messagesList.innerHTML = '';
    
    if (messages.length === 0) {
        messagesList.innerHTML = `
            <div class="flex items-center justify-center h-full text-gray-500">
                <div class="text-center">
                    <i class="fas fa-comments text-4xl mb-4"></i>
                    <p>Aucun message pour le moment</p>
                    <p class="text-sm">Commencez une conversation !</p>
                </div>
            </div>
        `;
        return;
    }

    // Grouper les messages par date
    const messagesParDate = {};
    messages.forEach(message => {
        const date = message.date || new Date().toLocaleDateString('fr-FR');
        if (!messagesParDate[date]) {
            messagesParDate[date] = [];
        }
        messagesParDate[date].push(message);
    });

    // Afficher les messages groupés par date
    Object.keys(messagesParDate).forEach(date => {
        const dateSeparator = document.createElement('div');
        dateSeparator.className = 'flex justify-center my-4';
        dateSeparator.innerHTML = `
            <span class="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                ${date}
            </span>
        `;
        messagesList.appendChild(dateSeparator);

        messagesParDate[date].forEach(message => {
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
    });
    
    // Faire défiler vers le bas
    document.getElementById('messagesArea').scrollTop = document.getElementById('messagesArea').scrollHeight;
}