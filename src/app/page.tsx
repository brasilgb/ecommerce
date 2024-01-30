import LinkApp from "@/components/linkapp";
import { checkUserUrlAccess } from "@/functions/check-user-url-access";

export default function Home() {
  console.log(checkUserUrlAccess());
  return (
    <main>
      <head>
        <title>Ecommerce - Portal Grupo Solar</title>
      </head>
      <div className="flex justify-center py-6">
        <h1 className="md:text-3xl text-xl font-semibold text-gray-600 drop-shadow">Bem vindo ao módulo E-commerce</h1>
      </div>
      <div className="grid md:grid-cols-4">
        <LinkApp
          bgColor="bg-blue-light"
          title='Enviar push'
          url="/enviarpush"
          titleColor="text-gray-light"
          text="Envia mensagem ao telefone do cliente"
          textColor="text-gray-dark"
        />
      </div>
    </main>
  )
}
