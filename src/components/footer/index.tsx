'use client'
import React from 'react'
import moment from "moment"
const Footer = () => {
    return (
        <div className="w-full py-1 bg-gray-light border-t border-white drop-shadow-md">
            <p className="text-xs text-center text-gray-700">{moment().format("YYYY")} Solar Comércio e Agroindústria Ltda. Todos os direitos reservados. | Desenvolvido por TI - Sistemas | Grupo Solar</p>
        </div>
    )
}

export default Footer