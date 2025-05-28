export const appData = {
    contacts: [
        {
            id: 1,
            nom: "Malick sylla",
            statut: "en ligne",
            avatar: "mS",
            image: "../public/MALICK.jpeg",
            archive: false,
            messages: []
        },
        {
            id: 2,
            nom: "Astou mbow",
            statut: "absent",
            avatar: "BD",
            image: "../public/toas.jpeg",
            archive: false, // Ajout de la propriété archive
            messages: [
            ]
        },
        {
            id: 3,
            nom: "yaye teden faye",
            statut: "en ligne",
            image: "../public/TEDEN.jpeg",

            avatar: "ES",
            archive: false, // Ajout de la propriété archive
            messages: [
             
            ]
        },
        {
            id: 4,
            nom: "binetou Sylla",
            statut: "en ligne",
            avatar: "AS",
            image: "../public/IMG_E2431.JPG",

            archive: false, // Ajout de la propriété archive
            messages: [
            ]
        }
    ],

    
    groupes: [
        {
            id: 1,
            nom: "Famille",
            membres: ["malick sylla ", " elisabet seck", "Moi"],
            avatar: "FA",
            messages: []
        }
    ],
    currentSection: "messages",
    currentContact: null
};
