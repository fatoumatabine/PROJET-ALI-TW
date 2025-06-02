// filepath: /chat-app/chat-app/src/js/validation.js

export function validateForm(nomComplet, telephone) {
    const regexTel = /^\+221\d{9}$/;

    if (!nomComplet || !regexTel.test(telephone)) {
        return false;
    }
    return true;
}