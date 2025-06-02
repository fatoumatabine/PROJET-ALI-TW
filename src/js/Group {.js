export class Group {
    constructor(id, nom, membres, avatar) {
        this.id = id;
        this.nom = nom;
        this.membres = membres;
        this.avatar = avatar;
        this.messages = [];
    }

    addMember(membre) {
        if (!this.membres.includes(membre)) {
            this.membres.push(membre);
            return true;
        }
        return false;
    }

    removeMember(membre) {
        const index = this.membres.indexOf(membre);
        if (index !== -1) {
            this.membres.splice(index, 1);
            return true;
        }
        return false;
    }

    renameGroup(newNom) {
        this.nom = newNom;
        this.avatar = newNom.split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    }
}