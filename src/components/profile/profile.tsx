'use client';
import { useAuthContext } from '@/contexts/AuthContext';
import { ChevronDown, KeyRound, LogOut, UserRound } from "lucide-react";
// import { useAuthContext } from "@/contexts/AuthContext";
import Link from 'next/link';
import { useState } from 'react';
// import { IoMdUnlock } from 'react-icons/io';
// import { IoExit, IoImage, IoKey, IoPerson } from 'react-icons/io5';
// import { MdOutlineKeyboardArrowDown } from 'react-icons/md';

const Profile = () => {
  const { signOut, user } = useAuthContext();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggle = () => {
    setIsOpen(old => !old);
  };
  const transClass = isOpen ? 'flex' : 'hidden';

  return (
    <>
      <div className="relative">
        <button
          className="flex items-center justify-between px-2"
          onClick={toggle}
        >
          <div className="text-gray-700">
            <UserRound color="#F6F5FA" size={20} />
          </div>
          <div className="text-gray-700">
            <ChevronDown
              color="#F6F5FA"
              size={20}
              className={`duration-300 ${isOpen ? '-rotate-180' : 'rotate-0'}`}
            />
          </div>
        </button>
        <div
          className={`absolute top-11 right-0 z-30 w-[350px] flex flex-col py-4 bg-gray-50 rounded-md shadow-lg border border-white ${transClass}`}
        >
          <span className="text-sm text-gray-600 px-4 pb-3 flex items-center">
            <UserRound color="#6d6a6a" size={20} />
            <span className="ml-1">{user?.userName}</span>
          </span>
          <span className="w-full border-b border-gray-200"></span>
          <Link
            className="text-gray-600 hover:text-gray-400 px-4 pt-2 flex items-center"
            href={`https://portal.gruposolar.com.br/changepassword?firstAccess=false&code=${user?.userCode}`}
            onClick={() => setIsOpen(false)}
          >
            <KeyRound color="#6d6a6a" size={20} />
            <span className="ml-1">Alterar minha senha</span>
          </Link>
          <button
            className="text-gray-600 hover:text-gray-400 px-4 pt-2 flex items-center"
            onClick={signOut}
          >
            <LogOut color="#6d6a6a" size={20} />
            <span className="ml-1">Sair</span>
          </button>
        </div>
      </div>
      {isOpen ? (
        <div
          className="fixed top-0 right-0 bottom-0 left-0 z-20 bg-black/5"
          onClick={toggle}
        ></div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Profile;
