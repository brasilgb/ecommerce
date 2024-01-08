'use client'
import React, { ReactNode, useEffect } from 'react';

import { useRouter, usePathname } from 'next/navigation';
import { checkUserAuthenticated } from "@/functions/check-user-authenticated";
import { APP_ROUTES } from "@/constants/app-routes";
import { checkUserUrlAccess } from "@/functions/check-user-url-access";

interface PrivateRouteProps {
    children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const isUserAutenticated = checkUserAuthenticated();
    const userUrlCheck = checkUserUrlAccess(pathname);
    console.log(userUrlCheck);
    
    useEffect(() => {
        if (!isUserAutenticated || !userUrlCheck) {
            router.push(APP_ROUTES.public.login);
        }
    }, [isUserAutenticated, router, userUrlCheck]);

    return (
        <>
            {!isUserAutenticated && null}
            {isUserAutenticated && children}
        </>
    );
};

export default PrivateRoute;