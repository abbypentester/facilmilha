'use client'

import React from 'react'
import { format } from 'date-fns'
import { CreateOfferDialog } from './create-offer-dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, ArrowRightLeft, Calendar, Users, Info, User } from 'lucide-react'

export function MarketplaceList({ requests }: { requests: any[] }) {
  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          Nenhuma solicitação em aberto no momento.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {requests.map((req) => (
        <Card key={req.id} className="group border-0 shadow-lg ring-1 ring-gray-200/50 bg-white/80 backdrop-blur-sm transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col">
          <CardHeader className="pb-3 bg-gray-50/50 border-b border-gray-100">
            <div className="flex justify-between items-start mb-2">
               <Badge variant={req.tripType === 'ROUND_TRIP' ? 'default' : 'secondary'} className="mb-2">
                 {req.tripType === 'ROUND_TRIP' ? <ArrowRightLeft className="w-3 h-3 mr-1" /> : <ArrowRight className="w-3 h-3 mr-1" />}
                 {req.tripType === 'ROUND_TRIP' ? 'Ida e Volta' : 'Só Ida'}
               </Badge>
               <Badge variant="outline" className="text-gray-500 border-gray-200">{req.status}</Badge>
            </div>
            
            <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
              {req.origin} <span className="text-blue-500">➔</span> {req.destination}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 pt-4 space-y-4">
            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <span className="text-xs text-gray-500 uppercase font-semibold flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Ida
                    </span>
                    <p className="font-medium text-gray-900">{new Date(req.departDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
                </div>
                {req.returnDate && (
                    <div className="space-y-1">
                        <span className="text-xs text-gray-500 uppercase font-semibold flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> Volta
                        </span>
                        <p className="font-medium text-gray-900">{new Date(req.returnDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
                    </div>
                )}
            </div>

            {/* Passengers & Flexibility */}
            <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                <div className="space-y-1">
                    <span className="text-xs text-gray-500 uppercase font-semibold flex items-center gap-1">
                        <Users className="w-3 h-3" /> Passageiros
                    </span>
                    <p className="font-medium text-gray-900">{req.passengersCount || 1} {req.passengersCount > 1 ? 'Pessoas' : 'Pessoa'}</p>
                </div>
                {req.flexibility && (
                    <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">
                        Flexível (+/- 1 dia)
                    </Badge>
                )}
            </div>

            {/* Observation */}
            {req.observation && (
                <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100 text-sm text-blue-800">
                    <p className="flex items-center gap-1 font-semibold mb-1 text-xs uppercase opacity-70">
                        <Info className="w-3 h-3" /> Observação
                    </p>
                    <p className="italic">"{req.observation}"</p>
                </div>
            )}

            <div className="pt-4 mt-auto border-t border-gray-100">
              <div className="flex justify-between items-center">
                 <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                        <User className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase tracking-wide font-semibold">Comprador</span>
                        <span className="text-xs font-bold text-gray-700 truncate max-w-[100px]">{req.buyer?.name?.split(' ')[0] || 'Viajante'}</span>
                    </div>
                 </div>
                 <CreateOfferDialog 
                    requestId={req.id} 
                    origin={req.origin} 
                    destination={req.destination}
                    departDate={req.departDate}
                    returnDate={req.returnDate}
                    tripType={req.tripType}
                    passengersCount={req.passengersCount || 1}
                  />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
