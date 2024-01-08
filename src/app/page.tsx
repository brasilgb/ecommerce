'use client'
import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const {authenticated} = useAuthContext();

  const router = useRouter();
  useEffect(() => {
    if(!authenticated) {
      return router.push('/');
    }
  },[authenticated, router]);

  return (
    <main>
      <div>Home</div>
    </main>
  )
}
