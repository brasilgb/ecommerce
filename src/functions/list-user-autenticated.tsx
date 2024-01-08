'use client';
export const listUserAuthenticated = () => {
    if (typeof window !== 'undefined') {
        const userLogged: any = localStorage.getItem('portal_user');
        return JSON.parse(userLogged);
    }
};
