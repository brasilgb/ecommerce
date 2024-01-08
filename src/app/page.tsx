'use client'
import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const {authenticated} = useAuthContext();
console.log(authenticated)
  const router = useRouter();
  useEffect(() => {
    if(!authenticated) {
      return router.push('http://portal.gruposolar.com.br');
    }
  },[authenticated, router]);

  return (
    <main>
      <div>Home</div>
    </main>
  )
}
