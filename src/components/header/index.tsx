'use client'
import React from 'react'
import Image from 'next/image';
import Profile from "../profile/profile"
import Link from "next/link"
import { useSearchParams } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";

const Header = () => {
  let stringdata: any = localStorage.getItem('portal_user');
  const jsondata = JSON.parse(stringdata);
  const apps = jsondata?.folders?.length;

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
        {apps > 1 &&
          <div className="flex-1 flex items-center justify-left pl-4">
            <Link
              href="http://portal.gruposolar.com.br"
              className="rounded-md px-3 py-1 flex items-center justify-center border-2 border-white shadow-md duration-300 bg-solar-green-prymary text-white"
            >
              <IoArrowBack /><span className="text-xs font-semibold uppercase ml-2 drop-shadow-sm">Portal</span>
            </Link>
          </div>
        }
        <div>
          <Profile />
        </div>
      </div>
    </header>
  );
};

export default Header;