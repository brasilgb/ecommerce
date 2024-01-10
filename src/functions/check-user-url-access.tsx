export const checkUserUrlAccess = () => {
    if (typeof window !== 'undefined') {
        const userLogged: any = localStorage.getItem('portal_user');
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