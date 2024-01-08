"use client";
import { useRouter } from "next/navigation";
import React, { ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";

const AuthContext = createContext({} as any);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

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