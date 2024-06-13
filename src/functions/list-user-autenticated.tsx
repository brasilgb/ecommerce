'use client';

import { getCookie } from "cookies-next";

export const listUserAuthenticated = () => {
    if (typeof window !== 'undefined') {
        const userLogged: any = getCookie('portal_access');
        return JSON.parse(userLogged);
    }
};
