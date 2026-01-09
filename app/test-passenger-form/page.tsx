import { PassengerForm } from "@/components/passenger-form"
import { Card, CardContent } from "@/components/ui/card"

export default function TestPassengerFormPage() {
  return (
    <div className="container mx-auto py-10 max-w-3xl bg-gray-50 min-h-screen">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Preview de Componente</h1>
        <p className="text-gray-500">Testando isoladamente: PassengerForm</p>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        {/* Passando um ID fictício apenas para renderizar */}
        <PassengerForm 
            flightRequestId="preview-mode-id" 
            onSuccess={() => alert("Formulário enviado com sucesso (Modo Preview)")} 
        />
      </div>
    </div>
  )
}
