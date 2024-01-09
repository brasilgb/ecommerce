'use client'
import React from 'react'
import Image from "next/image"
import Link from "next/link"

const Logo = () => {
  return (
    <Link
    href="http://portal.gruposolar.com.br"
    >
    <Image src={require('@/assets/images/logo_grupo_blue.png')} alt={"Logo"} height={40} />
    </Link>
  )
}

export default Logo