export function checkAuth() {
    if (!sessionStorage.getItem('isAdminLoggedIn')) {
        const currentPath = window.location.pathname;
        sessionStorage.setItem('redirectUrl', currentPath);
        window.location.href = "/";
    }
}

export function login(username, password) {
    if (username === "admin" && password === "123") {
        sessionStorage.setItem('isAdminLoggedIn', 'true');
        const redirectUrl = sessionStorage.getItem('redirectUrl') || '/mess.html';
        sessionStorage.removeItem('redirectUrl');
        return redirectUrl;
    }
    return false;
}

export function logout() {
    sessionStorage.clear();
    window.location.href = "/";
}