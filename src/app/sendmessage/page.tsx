import { Bell } from "lucide-react";
import React from 'react'

const SendMessage = () => {
  return (
    <div className="flex flex-col h-full w-full bg-gray-50 shadow-sm rounded-md border border-white">
      <header className="bg-gray-100 rounded-t-md p-4 flex items-center justify-start gap-4 text-zinc-600 border-b">
      <Bell />
      <h1 className="text-lg font-medium">Enviar mensagem ou notificação</h1>
      </header>
      <main className="flex-1">
        <div>
          <h1>Enviar para todos os clientes</h1>
        </div>
        <div>
          
        </div>
      </main>
      <footer className="bg-gray-100 rounded-b-md text-zinc-600 border-t">footer</footer>
    </div>
  )
}
export default SendMessage;