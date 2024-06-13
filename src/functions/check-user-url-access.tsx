import { getCookie } from "cookies-next";

export const checkUserUrlAccess = () => {
    if (typeof window !== 'undefined') {
        const userLogged: any = getCookie('portal_access');
        if (userLogged) {
            const path = window.location.pathname;
            const { folders } = JSON.parse(userLogged);
            const hasMatch = folders.some(function (value: any) {
                return value.path == path.split('/')[1]
            });
            return hasMatch;
        }
    }
};