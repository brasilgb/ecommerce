import LinkApp from "@/components/linkapp";

export default function Home() {

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
          bgColor="bg-solar-blue-primary"
          title='Mensagem ou notificação'
          url="/sendmessage"
          titleColor="text-solar-gray-light"
          text="Enviar mensagens ou notificações ao telefone do cliente"
          textColor="text-solar-gray-light"
        />
      </div>
    </main>
  )
}
