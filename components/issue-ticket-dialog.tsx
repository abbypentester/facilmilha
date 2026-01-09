'use client'

import { useState } from 'react'
import { submitProof } from '@/app/actions/flight'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Ticket, Upload, CheckCircle2 } from 'lucide-react'

export function IssueTicketDialog({ sale, triggerButton }: { sale: any, triggerButton?: React.ReactNode }) {
  const [proofLink, setProofLink] = useState('')
  const [pnr, setPnr] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)

  async function handleSubmit() {
    setError('')
    
    if (pnr.length !== 6) {
        setError('O Localizador (PNR) deve ter exatamente 6 caracteres.')
        return
    }

    setLoading(true)
    try {
        await submitProof(sale.id, proofLink, pnr)
        setOpen(false)
    } catch (err: any) {
        setError(err.message || 'Erro ao enviar comprovante. Tente novamente.')
    } finally {
        setLoading(false)
    }
  }

  const passengers = sale.flightRequest.passengers || []

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                <Ticket className="w-4 h-4" /> Emitir Passagem
            </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl text-emerald-700">
            <Ticket className="w-6 h-6" /> Emissão de Passagem
          </DialogTitle>
          <DialogDescription>
            Pedido #{sale.flightRequest.id.slice(0, 6)} • {sale.flightRequest.origin} ➔ {sale.flightRequest.destination}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
            {/* Dados dos Passageiros */}
            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    📋 Dados dos Passageiros
                    <span className="text-xs font-normal text-gray-500">(Copie para o site da cia aérea)</span>
                </h3>
                
                {passengers.length === 0 ? (
                    <div className="p-4 bg-orange-50 text-orange-800 text-sm rounded-lg border border-orange-200 flex items-center gap-3">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-800"></div>
                        Aguardando comprador preencher dados dos passageiros...
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {passengers.map((p: any, i: number) => (
                            <div key={i} className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-3">
                                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                                    <span className="font-bold text-gray-800">{p.firstName} {p.lastName}</span>
                                    <span className="text-xs bg-white px-2 py-1 rounded border text-gray-500">{p.gender === 'MALE' ? 'Masculino' : 'Feminino'}</span>
                                </div>
                                
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                                    <div>
                                        <span className="block text-gray-500 mb-1">Nascimento</span>
                                        <span className="font-medium text-gray-900">{new Date(p.birthDate).toLocaleDateString('pt-BR')}</span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-500 mb-1">Nacionalidade</span>
                                        <span className="font-medium text-gray-900">{p.nationality}</span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-500 mb-1">Documento ({p.documentType})</span>
                                        <span className="font-medium text-gray-900">{p.documentNumber}</span>
                                    </div>
                                    {p.passportExpiry && (
                                        <div>
                                            <span className="block text-gray-500 mb-1">Validade Passaporte</span>
                                            <span className="font-medium text-gray-900">{new Date(p.passportExpiry).toLocaleDateString('pt-BR')}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Formulário de Emissão */}
            {passengers.length > 0 && (
                <div className="space-y-4 bg-emerald-50/50 p-5 rounded-xl border border-emerald-100">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                            <Upload className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-emerald-900">Registrar Emissão</h4>
                            <p className="text-xs text-emerald-700 mt-1">
                                Após emitir no site da companhia, informe os dados abaixo para liberar seu pagamento.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="pnr" className="text-xs font-bold text-gray-700">Código Localizador (PNR)</Label>
                            <Input 
                                id="pnr"
                                placeholder="Ex: ABC123" 
                                value={pnr}
                                onChange={(e) => {
                                    setError('')
                                    setPnr(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))
                                }}
                                maxLength={6}
                                className={`bg-white ${error ? 'border-red-500' : ''}`}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="proof" className="text-xs font-bold text-gray-700">Link do Comprovante</Label>
                            <Input 
                                id="proof"
                                placeholder="https://..." 
                                value={proofLink}
                                onChange={(e) => setProofLink(e.target.value)}
                                className="bg-white"
                            />
                        </div>
                    </div>
                    
                    {error && (
                        <div className="text-red-600 text-xs font-medium bg-red-50 p-3 rounded-lg flex items-center gap-2">
                            ⚠️ {error}
                        </div>
                    )}

                    <Button 
                        onClick={handleSubmit} 
                        disabled={!proofLink || pnr.length !== 6 || loading} 
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm"
                    >
                        {loading ? 'Confirmando...' : 'Confirmar Emissão e Enviar'}
                    </Button>
                </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
