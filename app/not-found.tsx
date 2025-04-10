import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-4">Página não encontrada</h1>
      <p className="text-lg mb-8">A página que você está procurando não existe ou foi movida.</p>
      <Link href="/" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
        Voltar para a página inicial
      </Link>
    </div>
  )
}

