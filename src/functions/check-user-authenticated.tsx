import { getCookie } from "cookies-next";

export const checkUserAuthenticated = () => {
    if (typeof window !== 'undefined') {
        const userLogged = getCookie('portal_access');
        return !!userLogged;
    }
};