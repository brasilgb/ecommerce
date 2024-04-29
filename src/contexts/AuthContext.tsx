"use client";
import { useRouter } from "next/navigation";
import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext({} as any);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  // useEffect(() => {
  //   const setStorage = () => {
  //     const userData = {
  //       authenticated: true,
  //       userName: 'ANDERSON ROGERIO B RODRIGUES',
  //       token:
  //         '4279E72401E0370266372D022914B20226AF8A514BA79AD4FB7B7E339426AC80484BC7623B29CDF7A387022675C1A4A6A9108BFF7B3E0B8D49220B04751B62F71A50EDFA3231C18671A78E2F6E8E124D',
  //       programs: [
  //         {
  //           code: 2866,
  //           acesso: true,
  //         },
  //         {
  //           code: 2867,
  //           acesso: true,
  //         },
  //         {
  //           code: 2868,
  //           acesso: true,
  //         },
  //         {
  //           code: 2874,
  //           acesso: true,
  //         },
  //         {
  //           code: 2878,
  //           acesso: true,
  //         },
  //         {
  //           code: 2890,
  //           acesso: true,
  //         },
  //         {
  //           code: 2928,
  //           acesso: true,
  //         },
  //         {
  //           code: 2939,
  //           acesso: true,
  //         },
  //       ],
  //       folders: [
  //         {
  //           path: 'bi3',
  //         },
  //         {
  //           path: 'apptv',
  //         },
  //         {
  //           path: 'ecommerce',
  //         },
  //       ],
  //     };
  //     localStorage.setItem('portal_user', JSON.stringify(userData));
  //   };
  //   setStorage();
  // }, []);

  useEffect(() => {
      const loadStorage = async () => {
          const recoveredUser = localStorage.getItem('portal_user');
          if (recoveredUser) {
              setUser(JSON.parse(recoveredUser));
          }
      };
      loadStorage();
  }, []);

  const signOut = () => {
    localStorage.removeItem('portal_user');
    setUser(null);
    router.push('http://portal.gruposolar.com.br/login');
  }

  return (
    <AuthContext.Provider value={{
      authenticated: !!user,
      user,
      signOut,
      loading,
      setLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuthContext = () => useContext(AuthContext);