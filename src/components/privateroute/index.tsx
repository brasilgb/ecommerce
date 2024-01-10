'use client'
import React, { ReactNode, useEffect } from 'react';

import { useRouter } from 'next/navigation';
import { checkUserAuthenticated } from "@/functions/check-user-authenticated";
import { APP_ROUTES } from "@/constants/app-routes";
import { checkUserUrlAccess } from "@/functions/check-user-url-access";

interface PrivateRouteProps {
    children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const router = useRouter();
    const isUserAutenticated = checkUserAuthenticated();
    const isUrlAccess = checkUserUrlAccess();

    useEffect(() => {
        if (!isUserAutenticated) {
            router.push(APP_ROUTES.public.login);
        }
    }, [isUserAutenticated, router]);

    return (
        <>
            {!isUserAutenticated && null}
            {isUserAutenticated && children}
        </>
    );
};

export default PrivateRoute;