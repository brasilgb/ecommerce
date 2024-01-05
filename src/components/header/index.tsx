'use client'
import React from 'react'
import Logo from "../logo"
import Profile from "../profile/profile"
import Link from "next/link"

const Header = () => {
  return (
    <div className="w-full flex items-center justify-between bg-gray-middle border-b border-white shadow-sm py-2 px-4">
      <div>
        <Logo />
      </div>
      <div className="flex-1 flex items-center justify-start">
        <ul className="mx-10">
          <li>
          <Link
          className="text-base py-2 px-4 rounded-md shadow-sm border border-gray-300 bg-gray-200 hover:bg-gray-100 font-semibold text-blue-700"
          href="/enviarpush"
          >
          <span>Enviar Push</span>
          </Link>
          </li>
        </ul>
      </div>
      <div>
        <Profile />
      </div>
    </div>
  )
}

export default Header