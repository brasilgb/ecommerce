'use client'
import React from 'react'
import Image from 'next/image';
import Profile from "../profile/profile"
import Link from "next/link"
import { ArrowLeft } from "lucide-react";

const Header = () => {
  let stringdata: any = localStorage.getItem('portal_user');
  const jsondata = JSON.parse(stringdata);
  const apps = jsondata?.folders?.length;

  return (
    <header
      className={`bg-solar-blue-primary px-2 flex items-center`}
    >
      {apps > 1 &&
        <div className="flex-none flex items-center justify-left">
          <Link
            href="http://portal.gruposolar.com.br"
            className="rounded-md px-1 py-1 flex items-center justify-center border-2 border-white shadow-md duration-300 bg-solar-green-prymary text-white"
          >
            <ArrowLeft size={18} />
          </Link>
        </div>
      }
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