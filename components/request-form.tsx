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
      <CardHeader className="space-y-1 pb-2 px-3 md:px-6 md:pb-6 pt-3 md:pt-6">
        <CardTitle className="text-base md:text-2xl font-bold text-gray-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Plane className="w-4 h-4 md:w-6 md:h-6 text-blue-600 shrink-0" />
                Passagens aéreas
            </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 px-3 md:px-6 pb-3 md:pb-8">
        <form action={async (formData) => { await createFlightRequest(formData) }} className="space-y-4">
          
          {/* Trip Type Selector - Pills */}
          <div className="flex gap-2 mb-2 overflow-x-auto pb-1">
            <button 
                type="button"
                onClick={() => setTripType('ROUND_TRIP')}
                className={`px-4 py-1.5 text-xs md:text-sm font-medium rounded-full whitespace-nowrap transition-all ${tripType === 'ROUND_TRIP' ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
                Ida e volta
            </button>
            <button 
                type="button"
                onClick={() => setTripType('ONE_WAY')}
                className={`px-4 py-1.5 text-xs md:text-sm font-medium rounded-full whitespace-nowrap transition-all ${tripType === 'ONE_WAY' ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
                Só ida
            </button>
            <input type="hidden" name="tripType" value={tripType} />
          </div>

          <div className="space-y-3">
            {/* Origin & Destination Group */}
            <div className="relative flex flex-col bg-gray-50/50 rounded-xl border border-gray-200 overflow-hidden group focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-400 transition-all">
                {/* Origin */}
                <div className="relative p-3 border-b border-gray-100">
                    <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5 block">Origem</Label>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full border-2 border-gray-400 shrink-0" />
                        <AirportCombobox 
                            value={origin} 
                            onChange={setOrigin} 
                            name="origin" 
                            placeholder="De onde você vai sair?"
                            className="h-7 p-0 border-0 bg-transparent text-sm md:text-base font-medium placeholder:text-gray-400 focus:ring-0 w-full"
                        />
                    </div>
                </div>

                {/* Swap Button (Visual) */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
                    <div className="bg-white rounded-full p-1.5 shadow-sm border border-gray-100 text-blue-600">
                        <ArrowRightLeft className="w-3 h-3 rotate-90" />
                    </div>
                </div>

                {/* Destination */}
                <div className="relative p-3">
                    <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5 block">Destino</Label>
                    <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <AirportCombobox 
                            value={destination} 
                            onChange={setDestination} 
                            name="destination" 
                            placeholder="Para onde você vai?"
                            className="h-7 p-0 border-0 bg-transparent text-sm md:text-base font-medium placeholder:text-gray-400 focus:ring-0 w-full"
                        />
                    </div>
                </div>
            </div>

            {/* Dates Group */}
            <div className="grid grid-cols-2 bg-gray-50/50 rounded-xl border border-gray-200 overflow-hidden divide-x divide-gray-100">
                <div className="p-3 hover:bg-gray-100/50 transition-colors cursor-pointer relative group">
                    <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5 block">Datas</Label>
                    <div className="flex items-center gap-2">
                        <CalendarIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"ghost"}
                                    className={cn(
                                        "h-7 p-0 w-full justify-start font-medium text-sm md:text-base hover:bg-transparent hover:text-inherit",
                                        !date && "text-gray-400 font-normal"
                                    )}
                                >
                                    {date ? format(date, "dd MMM", { locale: ptBR }) : "Ida"}
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
                    </div>
                    <input type="hidden" name="date" value={date ? format(date, 'yyyy-MM-dd') : ''} />
                </div>

                <div className={`p-3 transition-colors relative ${tripType === 'ONE_WAY' ? 'bg-gray-100/50 cursor-not-allowed opacity-60' : 'hover:bg-gray-100/50 cursor-pointer'}`}>
                    <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5 block opacity-0">Volta</Label>
                    <div className="flex items-center gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"ghost"}
                                    disabled={tripType === 'ONE_WAY'}
                                    className={cn(
                                        "h-7 p-0 w-full justify-start font-medium text-sm md:text-base hover:bg-transparent hover:text-inherit",
                                        !returnDate && "text-gray-400 font-normal"
                                    )}
                                >
                                    {returnDate ? format(returnDate, "dd MMM", { locale: ptBR }) : "Volta"}
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
                    </div>
                    <input type="hidden" name="returnDate" value={returnDate ? format(returnDate, 'yyyy-MM-dd') : ''} />
                </div>
            </div>

            {/* Flexible Dates Toggle */}
            <div className="flex items-center justify-between px-1">
                <Label htmlFor="flexibility" className="text-xs font-medium text-gray-600 cursor-pointer">
                    Buscar pela data mais barata
                </Label>
                <div className="relative inline-flex items-center cursor-pointer">
                    <input 
                        type="checkbox" 
                        id="flexibility" 
                        name="flexibility" 
                        className="peer sr-only"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </div>
            </div>

            {/* Passengers Group */}
            <div className="bg-gray-50/50 rounded-xl border border-gray-200 p-3 hover:bg-gray-100/50 transition-colors">
                <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5 block">Passageiros</Label>
                <div className="flex items-center gap-2 relative">
                    <Users className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <select 
                        id="passengersCount"
                        name="passengersCount"
                        value={passengers}
                        onChange={(e) => setPassengers(Number(e.target.value))}
                        className="appearance-none bg-transparent border-none p-0 h-7 text-sm md:text-base font-medium w-full focus:ring-0 cursor-pointer"
                    >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                            <option key={num} value={num}>
                                {num} {num === 1 ? 'pessoa' : 'pessoas'}, Econômica
                            </option>
                        ))}
                    </select>
                </div>
            </div>
          </div>
          
          {/* Observation Field (Collapsed by default logic or simplified) */}
          <div className="space-y-1">
            <textarea 
              id="observation" 
              name="observation" 
              placeholder="Alguma observação especial?" 
              className="flex min-h-[40px] w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-xs ring-offset-background placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all resize-none"
            />
          </div>

          <Button type="submit" className="w-full h-12 text-base font-bold bg-[#E63946] hover:bg-[#d62839] text-white shadow-lg shadow-red-500/20 transition-all duration-300 rounded-full mt-4">
            <Search className="w-4 h-4 mr-2" />
            Buscar
          </Button>
        </form>
      </CardContent>
    </Card>
        </form>
      </CardContent>
    </Card>
  )
}
