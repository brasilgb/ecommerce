'use client';
export const checkUserUrlAccess = (pathname:string) => {
    const path = window.location.pathname;
    if (typeof window !== 'undefined') {
        const userLogged: any = localStorage.getItem('portal_user');
        if (userLogged) {
            const { folders } = JSON.parse(userLogged);
            const hasMatch = folders.some(function (value: any) {
                return value.path == path.split('/')[1]
            });
            return hasMatch;
        }
    }
};