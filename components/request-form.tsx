'use client'

import { createFlightRequest } from '@/app/actions/flight'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { AirportCombobox } from '@/components/airport-combobox'
import { useState } from 'react'
import { Plane, MapPin, Calendar as CalendarIcon, Users, ArrowRightLeft, Search, Plus, Minus, Info } from 'lucide-react'
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
  const [isRotating, setIsRotating] = useState(false)

  const handleSwap = () => {
    setIsRotating(true)
    const temp = origin
    setOrigin(destination)
    setDestination(temp)
    setTimeout(() => setIsRotating(false), 500)
  }

  const handleIncrement = () => {
    if (passengers < 9) setPassengers(prev => prev + 1)
  }

  const handleDecrement = () => {
    if (passengers > 1) setPassengers(prev => prev - 1)
  }

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-xl ring-1 ring-gray-200 overflow-hidden rounded-3xl w-full">
      <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
      
      <CardHeader className="px-4 md:px-6 pt-5 md:pt-6 pb-2">
        <CardTitle className="flex items-center gap-2.5 text-lg md:text-xl font-bold text-gray-900">
          <div className="bg-blue-50 p-2 rounded-xl">
            <Plane className="w-5 h-5 text-blue-600" />
          </div>
          Planeje sua viagem
        </CardTitle>
      </CardHeader>

      <CardContent className="px-4 md:px-5 pb-6 pt-2">
        <form action={async (formData) => { await createFlightRequest(formData) }} className="space-y-4 md:space-y-5">
          
          {/* Trip Type Segmented Control */}
          <div className="bg-gray-100/80 p-1 rounded-xl flex relative">
            <div 
              className={cn(
                "absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-all duration-300 ease-spring",
                tripType === 'ONE_WAY' ? "left-1" : "left-[calc(50%+4px)]"
              )}
            />
            <button 
                type="button"
                onClick={() => setTripType('ONE_WAY')}
                className={cn(
                  "flex-1 relative z-10 py-2 text-sm font-semibold text-center transition-colors rounded-lg",
                  tripType === 'ONE_WAY' ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
                )}
            >
                Só Ida
            </button>
            <button 
                type="button"
                onClick={() => setTripType('ROUND_TRIP')}
                className={cn(
                  "flex-1 relative z-10 py-2 text-sm font-semibold text-center transition-colors rounded-lg",
                  tripType === 'ROUND_TRIP' ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
                )}
            >
                Ida e Volta
            </button>
            <input type="hidden" name="tripType" value={tripType} />
          </div>

          <div className="space-y-3">
            {/* Origin & Destination Block */}
            <div className="relative flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden group focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-400 transition-all">
                {/* Origin */}
                <div className="relative p-3.5 border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block pl-1">Origem</Label>
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full border-[3px] border-blue-500 shrink-0" />
                        <AirportCombobox 
                            value={origin} 
                            onChange={setOrigin} 
                            name="origin" 
                            placeholder="De onde?"
                            className="h-8 p-0 border-0 bg-transparent text-lg font-semibold text-gray-900 placeholder:text-gray-300 focus:ring-0 w-full"
                        />
                    </div>
                </div>

                {/* Swap Button */}
                <button
                    type="button"
                    onClick={handleSwap}
                    className="absolute right-6 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 active:bg-gray-100 rounded-full p-2 shadow-md border border-gray-100 text-blue-600 transition-all hover:scale-110 active:scale-95"
                    aria-label="Inverter origem e destino"
                >
                    <ArrowRightLeft className={cn("w-4 h-4 transition-transform duration-500", isRotating && "rotate-180")} />
                </button>

                {/* Destination */}
                <div className="relative p-3.5 hover:bg-gray-50/50 transition-colors">
                    <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block pl-1">Destino</Label>
                    <div className="flex items-center gap-3">
                        <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 fill-current" />
                        <AirportCombobox 
                            value={destination} 
                            onChange={setDestination} 
                            name="destination" 
                            placeholder="Para onde?"
                            className="h-8 p-0 border-0 bg-transparent text-lg font-semibold text-gray-900 placeholder:text-gray-300 focus:ring-0 w-full"
                        />
                    </div>
                </div>
            </div>

            {/* Dates & Passengers Grid */}
            <div className="grid grid-cols-2 gap-3">
                {/* Dates */}
                <div className="col-span-2 sm:col-span-1 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                    <Popover>
                        <PopoverTrigger asChild>
                            <button type="button" className="flex-1 p-3.5 text-left hover:bg-gray-50 transition-colors group w-full">
                                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block group-hover:text-blue-500 transition-colors">Data de Ida</Label>
                                <div className="flex items-center gap-2">
                                    <CalendarIcon className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                    <span className={cn("text-base font-semibold", !date && "text-gray-300")}>
                                        {date ? format(date, "dd MMM", { locale: ptBR }) : "Escolher"}
                                    </span>
                                </div>
                                {date && <span className="text-xs text-gray-400 block mt-0.5">{format(date, "EEEE", { locale: ptBR })}</span>}
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus locale={ptBR} />
                        </PopoverContent>
                    </Popover>
                    <input type="hidden" name="date" value={date ? format(date, 'yyyy-MM-dd') : ''} />
                </div>

                {/* Return Date (Conditional) */}
                <div className={cn(
                    "col-span-2 sm:col-span-1 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col transition-all",
                    tripType === 'ONE_WAY' ? "opacity-50 cursor-not-allowed bg-gray-50" : "opacity-100"
                )}>
                    <Popover>
                        <PopoverTrigger asChild>
                            <button 
                                type="button" 
                                disabled={tripType === 'ONE_WAY'}
                                className="flex-1 p-3.5 text-left hover:bg-gray-50 transition-colors group w-full disabled:hover:bg-transparent"
                            >
                                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block group-hover:text-blue-500 transition-colors">Data de Volta</Label>
                                <div className="flex items-center gap-2">
                                    <CalendarIcon className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                    <span className={cn("text-base font-semibold", !returnDate && "text-gray-300")}>
                                        {returnDate ? format(returnDate, "dd MMM", { locale: ptBR }) : "Escolher"}
                                    </span>
                                </div>
                                {returnDate && <span className="text-xs text-gray-400 block mt-0.5">{format(returnDate, "EEEE", { locale: ptBR })}</span>}
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={returnDate} onSelect={setReturnDate} initialFocus disabled={tripType === 'ONE_WAY'} locale={ptBR} />
                        </PopoverContent>
                    </Popover>
                    <input type="hidden" name="returnDate" value={returnDate ? format(returnDate, 'yyyy-MM-dd') : ''} />
                </div>

                {/* Passengers Counter */}
                <div className="col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-3.5 flex items-center justify-between">
                    <div>
                        <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5 block">Passageiros</Label>
                        <div className="flex items-center gap-2 text-gray-900 font-semibold">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span>{passengers} {passengers === 1 ? 'Pessoa' : 'Pessoas'}</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                        <button 
                            type="button" 
                            onClick={handleDecrement}
                            disabled={passengers <= 1}
                            className="w-8 h-8 flex items-center justify-center rounded-md bg-white shadow-sm border border-gray-200 text-gray-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-90"
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-4 text-center font-bold text-gray-700">{passengers}</span>
                        <button 
                            type="button" 
                            onClick={handleIncrement}
                            disabled={passengers >= 9}
                            className="w-8 h-8 flex items-center justify-center rounded-md bg-white shadow-sm border border-gray-200 text-gray-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-90"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                    <input type="hidden" name="passengersCount" value={passengers} />
                </div>
            </div>

            {/* Flexible Dates Toggle - Simplified */}
            <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors border border-transparent hover:border-gray-100">
                <div className="relative inline-flex items-center">
                    <input type="checkbox" name="flexibility" className="peer sr-only" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </div>
                <span className="text-sm font-medium text-gray-600">Buscar datas flexíveis (+/- 1 dia)</span>
            </label>
          </div>
          
          {/* Observation Field */}
          <div className="relative">
             <div className="absolute top-3 left-3 text-gray-400">
                <Info className="w-4 h-4" />
             </div>
             <textarea 
               name="observation" 
               placeholder="Alguma observação especial? (Opcional)" 
               className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none min-h-[50px]"
             />
          </div>

          <Button type="submit" className="w-full h-14 text-lg font-bold bg-[#E63946] hover:bg-[#d62839] text-white shadow-xl shadow-red-500/20 hover:shadow-red-500/30 active:scale-[0.98] transition-all duration-300 rounded-2xl">
            <Search className="w-5 h-5 mr-2" />
            Buscar Ofertas
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
