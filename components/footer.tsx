import Link from 'next/link'
import { Plane } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-blue-600">
              <div className="bg-blue-50 p-1.5 rounded-lg">
                <Plane className="h-5 w-5" />
              </div>
              FacilMilha
            </Link>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
              Marketplace P2P simplificado para emissão de passagens com milhas. 
              Conectando viajantes e milheiros com transparência e segurança.
            </p>
          </div>
          
          {/* Links 1 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">Plataforma</h3>
            <ul className="space-y-2.5 text-sm text-gray-600">
              <li>
                <Link href="/dashboard" className="hover:text-blue-600 transition-colors block py-1">
                    Minhas Solicitações
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-600 transition-colors block py-1">
                    Como Funciona
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-600 transition-colors block py-1">
                    Dicas de Segurança
                </Link>
              </li>
            </ul>
          </div>

          {/* Links 2 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">Legal</h3>
            <ul className="space-y-2.5 text-sm text-gray-600">
              <li>
                <Link href="#" className="hover:text-blue-600 transition-colors block py-1">
                    Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-600 transition-colors block py-1">
                    Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-600 transition-colors block py-1">
                    Central de Ajuda
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} FacilMilha. Todos os direitos reservados.</p>
          <div className="flex items-center gap-1">
            <span>Feito com ✈️ para</span>
            <span className="font-medium text-gray-600">viajantes inteligentes</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
