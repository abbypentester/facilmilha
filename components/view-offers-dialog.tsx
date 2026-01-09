'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatCurrency } from "@/lib/utils"
import { Clock, ThumbsUp, Plane, Ticket, Check } from "lucide-react"
import { acceptOffer } from '@/app/actions/flight'
import { toast } from "sonner"

interface ViewOffersDialogProps {
  request: any
  trigger?: React.ReactNode
}

export function ViewOffersDialog({ request, trigger }: ViewOffersDialogProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleAccept = async (offerId: string) => {
    try {
      setLoadingId(offerId)
      const res = await acceptOffer(offerId)
      if (res.checkoutUrl) {
        toast.success("Oferta aceita! Redirecionando para pagamento...")
        router.push(res.checkoutUrl)
      } else {
        toast.error("Erro ao processar aceitação.")
      }
    } catch (error) {
      console.error(error)
      toast.error("Erro ao aceitar oferta.")
    } finally {
        setLoadingId(null)
    }
  }

  // Sort offers by price (cheapest first)
  const offers = request.offers?.sort((a: any, b: any) => a.totalPrice - b.totalPrice) || []

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button size="sm">Ver Ofertas</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ofertas Recebidas</DialogTitle>
          <DialogDescription>
             Escolha a melhor oferta para sua viagem de {request.origin} para {request.destination}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {offers.length === 0 ? (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed">
              <Ticket className="w-12 h-12 mx-auto text-gray-300 mb-2" />
              <p>Ainda não há ofertas para esta solicitação.</p>
              <p className="text-sm">Aguarde, os milheiros estão analisando seu pedido.</p>
            </div>
          ) : (
            offers.map((offer: any) => (
              <div key={offer.id} className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                 
                 <div className="flex flex-col md:flex-row justify-between gap-4">
                    {/* Seller Info */}
                    <div className="flex items-start gap-3">
                        <Avatar>
                            <AvatarImage src={offer.seller?.avatarUrl} />
                            <AvatarFallback>{offer.seller?.name?.charAt(0) || 'M'}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold text-gray-900">{offer.seller?.name || 'Milheiro'}</p>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                <ThumbsUp className="w-3 h-3 text-green-600" />
                                <span>{offer.seller?.ratingsReceived?.length || 0} avaliações</span>
                            </div>
                            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                                <Plane className="w-4 h-4" />
                                <span className="font-medium">{offer.airline}</span>
                            </div>
                        </div>
                    </div>

                    {/* Price and Action */}
                    <div className="flex flex-col items-end gap-2">
                        <div className="text-right">
                            <span className="text-xs text-gray-500 block">Preço Total</span>
                            <span className="text-2xl font-bold text-blue-600">{formatCurrency(offer.totalPrice)}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                            <Clock className="w-3 h-3" />
                            <span>Emissão em até {offer.emissionDeadline}</span>
                        </div>

                        <Button 
                            onClick={() => handleAccept(offer.id)} 
                            disabled={loadingId === offer.id}
                            className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white"
                        >
                            {loadingId === offer.id ? "Processando..." : "Aceitar Oferta"}
                        </Button>
                    </div>
                 </div>
                 
                 {offer.observation && (
                    <div className="mt-3 pt-3 border-t text-sm text-gray-600 bg-gray-50/50 -mx-4 -mb-4 px-4 py-2">
                        <span className="font-medium text-gray-700">Nota do Milheiro:</span> {offer.observation}
                    </div>
                 )}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
