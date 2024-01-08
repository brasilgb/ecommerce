export const checkUserAuthenticated = () => {
    if (typeof window !== 'undefined') {
        const userLogged = localStorage.getItem('portal_user');
        return !!userLogged;
    }
};