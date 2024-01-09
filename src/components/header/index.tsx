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

      </div>
      <div>
        <Profile />
      </div>
    </div>
  )
}

export default Header