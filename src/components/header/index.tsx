'use client'
import React from 'react'
import Image from 'next/image';
import Profile from "../profile/profile"
import Link from "next/link"
import { useSearchParams } from "next/navigation";

const Header = () => {
  const searchParams = useSearchParams();
  const depto = searchParams.get('depto');

  return (
    <header
      className={`bg-solar-blue-primary px-2`}
    >
      <div className="container py-1 mx-auto flex items-center justify-between h-16">
        <div
          className={`flex items-center w-28 p-0.5`}
        >
          <Link href='http://portal.gruposolar.com.br/'>
            <Image
              layout="responsive"
              src={require('@/assets/logo/logo_solar.png')}
              width={120}
              height={40}
              alt={''}
            />
          </Link>
        </div>
        <div>
          <Profile />
        </div>
      </div>
    </header>
  );
};

export default Header;