'use client'

import React, { useState } from 'react'
import { createOffer } from '@/app/actions/flight'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plane, Calendar, Users, ArrowRight, ArrowRightLeft } from 'lucide-react'

interface CreateOfferDialogProps {
  requestId: string
  origin: string
  destination: string
  departDate: Date
  returnDate?: Date | null
  tripType: string
  passengersCount: number
}

export function CreateOfferDialog({ 
  requestId, 
  origin, 
  destination,
  departDate,
  returnDate,
  tripType,
  passengersCount
}: CreateOfferDialogProps) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState<number | ''>('')
  const [emissionDeadline, setEmissionDeadline] = useState('')
  const [observation, setObservation] = useState('')
  const [airline, setAirline] = useState('')
  const [loading, setLoading] = useState(false)

  // Cálculos visuais (devem bater com o backend)
  const val = Number(amount) || 0
  const fee = val * 0.15
  const buyerPays = val + fee
  const sellerReceives = val - fee

  async function handleSubmit() {
    if (!amount || !airline) return
    setLoading(true)
    try {
        await createOffer(requestId, Number(amount), emissionDeadline, observation, airline)
        setOpen(false)
        setAmount('')
        setEmissionDeadline('')
        setObservation('')
        setAirline('')
    } catch (error) {
        console.error(error)
    } finally {
        setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition-all hover:shadow-md">
            Fazer Oferta
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plane className="w-5 h-5 text-blue-600" />
            Ofertar Voo
          </DialogTitle>
          <DialogDescription asChild>
            <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-100 space-y-2">
              <div className="flex items-center justify-between font-bold text-gray-900">
                <span>{origin}</span>
                <span className="text-gray-400">➔</span>
                <span>{destination}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  {tripType === 'ROUND_TRIP' ? <ArrowRightLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
                  {tripType === 'ROUND_TRIP' ? 'Ida e Volta' : 'Só Ida'}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {passengersCount} {passengersCount > 1 ? 'Pessoas' : 'Pessoa'}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Ida: {new Date(departDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                </div>
                {returnDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Volta: {new Date(returnDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                  </div>
                )}
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="airline" className="text-gray-700 font-semibold">Companhia Aérea <span className="text-red-500">*</span></Label>
            <Input
              id="airline"
              placeholder="Ex: Latam, Gol, Azul..."
              value={airline}
              onChange={(e) => setAirline(e.target.value)}
              className="border-gray-300 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-gray-700 font-semibold">Valor Base da Emissão (R$) <span className="text-red-500">*</span></Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="border-gray-300 focus:border-blue-500 font-mono"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="deadline" className="text-gray-700 font-semibold">Prazo para Emissão</Label>
            <Input
              id="deadline"
              placeholder="Ex: Até 24h, Imediato..."
              value={emissionDeadline}
              onChange={(e) => setEmissionDeadline(e.target.value)}
              className="border-gray-300 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="obs" className="text-gray-700 font-semibold">Observações (Opcional)</Label>
            <Input
              id="obs"
              placeholder="Ex: Inclui bagagem despachada..."
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              className="border-gray-300 focus:border-blue-500"
            />
          </div>
          
          {val > 0 && (
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-sm space-y-3">
              <div className="space-y-2">
                  <div className="flex justify-between items-center text-gray-600">
                    <span>Valor Base:</span>
                    <span className="font-semibold">R$ {val.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-red-600/80 text-xs">
                    <span>Taxa da Plataforma (-15%):</span>
                    <span>- R$ {fee.toFixed(2)}</span>
                  </div>
                  
                  <div className="h-px bg-gray-200" />
                  
                  <div className="flex justify-between items-center text-blue-700 pt-1">
                    <span className="font-bold">Comprador paga (+15%):</span>
                    <span className="font-bold">R$ {buyerPays.toFixed(2)}</span>
                  </div>
              </div>

              <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                  <div className="flex justify-between items-center text-emerald-800">
                    <span className="font-bold text-sm">Você recebe (Líquido):</span>
                    <span className="font-bold text-lg">R$ {sellerReceives.toFixed(2)}</span>
                  </div>
                  <p className="text-[10px] text-emerald-600/80 mt-1 text-right">
                      *Disponível 5 dias após confirmação
                  </p>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button 
            onClick={handleSubmit} 
            disabled={!amount || !airline || loading} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6 shadow-md transition-all hover:shadow-lg"
          >
            {loading ? 'Enviando...' : 'Confirmar Oferta'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
