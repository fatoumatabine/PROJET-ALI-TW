// Initialisation de l'application
document.addEventListener('DOMContentLoaded', function() {
    ajouterToastifyCSS();
    initializeApp();
    setupEventListeners();
    afficherContacts();
});

function initializeApp() {
    document.querySelector('.sidebar-btn[data-section="messages"]').classList.add('active-section');
}

function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.sidebar-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.dataset.section;
            changerSection(section);
        });
    });

    // Messages
    document.getElementById('sendBtn').addEventListener('click', envoyerMessage);
    document.getElementById('messageText').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') envoyerMessage();
    });

    // Recherche
    document.getElementById('searchContacts').addEventListener('input', function() {
        filtrerContacts(this.value.toLowerCase());
    });

    // Actions
    document.getElementById('archiveBtn').addEventListener('click', toggleArchive);
    document.getElementById('blockBtn').addEventListener('click', bloquerContact);
    document.getElementById('deleteBtn').addEventListener('click', supprimerConversation);
}