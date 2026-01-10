'use client'

import { createFlightRequest } from '@/app/actions/flight'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { AirportCombobox } from '@/components/airport-combobox'
import { useState } from 'react'
import { Plane, MapPin, Calendar as CalendarIcon, Users, ArrowRightLeft, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export function RequestForm() {
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [tripType, setTripType] = useState('ONE_WAY')
  const [passengers, setPassengers] = useState(1)
  const [date, setDate] = useState<Date>()
  const [returnDate, setReturnDate] = useState<Date>()

  return (
    <Card className="shadow-lg md:shadow-2xl border-0 bg-white ring-1 ring-gray-100 overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
      <CardHeader className="space-y-1 pb-4 px-4 md:px-6 md:pb-6">
        <CardTitle className="text-lg md:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Plane className="w-5 h-5 md:w-6 md:h-6 text-blue-600 shrink-0" />
            Solicitar Nova Viagem
        </CardTitle>
        <CardDescription className="text-xs md:text-base text-gray-500">
            Preencha os dados abaixo para receber ofertas.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-4 md:px-6 pb-6 md:pb-8">
        <form action={async (formData) => { await createFlightRequest(formData) }} className="space-y-5 md:space-y-6">
          
          {/* Trip Type Selector */}
          <div className="flex p-1 bg-gray-100 rounded-xl mb-4 md:mb-6 h-14 items-center">
            <button 
                type="button"
                onClick={() => setTripType('ONE_WAY')}
                className={`flex-1 h-12 text-sm md:text-base font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${tripType === 'ONE_WAY' ? 'bg-white shadow-sm text-blue-600 ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
            >
                <ArrowRight className="w-4 h-4" /> Só Ida
            </button>
            <button 
                type="button"
                onClick={() => setTripType('ROUND_TRIP')}
                className={`flex-1 h-12 text-sm md:text-base font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${tripType === 'ROUND_TRIP' ? 'bg-white shadow-sm text-blue-600 ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
            >
                <ArrowRightLeft className="w-4 h-4" /> Ida/Volta
            </button>
            <input type="hidden" name="tripType" value={tripType} />
          </div>

          <div className="space-y-4">
            {/* Origin & Destination */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" /> Origem
                </Label>
                <div className="relative">
                    <AirportCombobox 
                        value={origin} 
                        onChange={setOrigin} 
                        name="origin" 
                        placeholder="De onde?"
                    />
                </div>
                </div>

                <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" /> Destino
                </Label>
                <div className="relative">
                    <AirportCombobox 
                        value={destination} 
                        onChange={setDestination} 
                        name="destination" 
                        placeholder="Para onde?"
                    />
                </div>
                </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div className="space-y-2">
                    <Label htmlFor="date" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-gray-400" /> Data de Ida
                    </Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full h-11 justify-start text-left font-normal border-gray-200 hover:bg-white focus:border-blue-500 focus:ring-blue-200 transition-all rounded-lg text-base md:text-sm",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : <span>Selecione uma data</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                                locale={ptBR}
                            />
                        </PopoverContent>
                    </Popover>
                    <input type="hidden" name="date" value={date ? format(date, 'yyyy-MM-dd') : ''} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="returnDate" className={`text-sm font-semibold flex items-center gap-2 transition-colors ${tripType === 'ONE_WAY' ? 'text-gray-300' : 'text-gray-700'}`}>
                        <CalendarIcon className={`w-4 h-4 ${tripType === 'ONE_WAY' ? 'text-gray-200' : 'text-gray-400'}`} /> Data de Volta
                    </Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                disabled={tripType === 'ONE_WAY'}
                                className={cn(
                                    "w-full h-11 justify-start text-left font-normal transition-all rounded-lg text-base md:text-sm",
                                    !returnDate && "text-muted-foreground",
                                    tripType === 'ONE_WAY' ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200 hover:bg-white'
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {returnDate ? format(returnDate, "dd/MM/yyyy", { locale: ptBR }) : <span>Selecione uma data</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={returnDate}
                                onSelect={setReturnDate}
                                initialFocus
                                disabled={(date) => tripType === 'ONE_WAY'}
                                locale={ptBR}
                            />
                        </PopoverContent>
                    </Popover>
                    <input type="hidden" name="returnDate" value={returnDate ? format(returnDate, 'yyyy-MM-dd') : ''} />
                </div>
            </div>
            
            {/* Passengers */}
            <div className="space-y-2">
                <Label htmlFor="passengersCount" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" /> Passageiros
                </Label>
                <div className="relative">
                    <select 
                        id="passengersCount"
                        name="passengersCount"
                        value={passengers}
                        onChange={(e) => setPassengers(Number(e.target.value))}
                        className="flex h-12 w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-base md:text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                    >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                            <option key={num} value={num}>
                                {num} {num === 1 ? 'Passageiro' : 'Passageiros'}
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                        <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                    </div>
                </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-blue-50/50 rounded-lg border border-blue-100/50">
            <input 
              type="checkbox" 
              id="flexibility" 
              name="flexibility" 
              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <Label htmlFor="flexibility" className="font-medium text-gray-700 cursor-pointer select-none text-sm">
              Tenho flexibilidade de datas (+/- 1 dia)
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observation" className="text-sm font-semibold text-gray-700">Observações (Opcional)</Label>
            <textarea 
              id="observation" 
              name="observation" 
              placeholder="Ex: Prefiro voos diurnos, aceito escala..." 
              className="flex min-h-[80px] w-full rounded-lg border border-gray-200 bg-background px-3 py-2 text-base md:text-sm ring-offset-background placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all resize-none"
            />
          </div>

          <Button type="submit" className="w-full h-12 text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-blue-500/25 transition-all duration-300 rounded-xl">
            Solicitar Viagem
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
