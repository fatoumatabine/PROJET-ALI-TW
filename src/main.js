const { createApp } = Vue

createApp({
  data() {
    return {
      contacts: [],
      groups: [],
      newContact: {
        name: '',
        email: '',
        avatar: '#4A3428'
      },
      newGroup: {
        name: '',
        members: []
      },
      showContactForm: false,
      showGroupForm: false,
      selectedGroup: null
    }
  },
  methods: {
    addContact() {
      if (this.newContact.name && this.newContact.email) {
        this.contacts.push({
          id: Date.now(),
          ...this.newContact
        })
        this.newContact = {
          name: '',
          email: '',
          avatar: '#4A3428'
        }
        this.showContactForm = false
      }
    },
    addGroup() {
      if (this.newGroup.name) {
        this.groups.push({
          id: Date.now(),
          ...this.newGroup,
          members: []
        })
        this.newGroup = {
          name: '',
          members: []
        }
        this.showGroupForm = false
      }
    },
    addMemberToGroup(contactId) {
      if (this.selectedGroup) {
        const contact = this.contacts.find(c => c.id === contactId)
        if (contact && !this.selectedGroup.members.includes(contactId)) {
          this.selectedGroup.members.push(contactId)
        }
      }
    }
  }
}).mount('#app')
