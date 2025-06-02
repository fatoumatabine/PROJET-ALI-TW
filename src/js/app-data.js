// Données de l'application
export const appData = {
  currentUser: null,
  contacts: [
      {
          id: 1,
          nom: "Malick sylla",
          telephone: "771234567",
          statut: "offline",
          avatar: "MS",
          archive: false,
          isOnline: true,
          messages: []
      },
      {
          id: 2,
          nom: "Astou mbow",
          telephone: "772345678",
          statut: "absent",
          avatar: "BD",
          archive: false,
          messages: []
      },
      {
          id: 3,
          nom: "yaye teden faye",
          telephone: "773456789",
          statut: "en ligne",
          avatar: "ES",
          archive: false,
          messages: []
      },
      {
          id: 4,
          nom: "binetou Sylla",
          telephone: "774567890",
          statut: "en ligne",
          avatar: "AS",
          archive: false,
          messages: []
      }
  ],
  groupes: [
      {
          id: 1,
          nom: "Famille",
          membres: ["malick sylla", "elisabet seck", "Moi"],
          admins: ["Moi"],
          avatar: "FA",
          messages: []
      }
  ],
  currentSection: "messages",
  currentContact: null,
  listeDiffusion: []
};