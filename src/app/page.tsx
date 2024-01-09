import LinkApp from "@/components/linkapp";

export default function Home() {
  return (
    <main>
      <div className="flex justify-center py-6">
        <h1 className="text-3xl font-semibold text-gray-600">Bem vindo ao módulo E-commerce</h1>
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
