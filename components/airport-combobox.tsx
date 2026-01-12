'use client'

import * as React from "react"
import { Check, ChevronsUpDown, Plane, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { airports } from "@/lib/airports"

interface AirportComboboxProps {
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  name?: string
  className?: string
}

export function AirportCombobox({ value = "", onChange, placeholder = "Selecione...", name, className }: AirportComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  // Reset search when opening
  React.useEffect(() => {
    if (!open) {
      setSearch("")
    }
  }, [open])

  const selectedAirport = React.useMemo(() => 
    airports.find((airport) => airport.code === value),
    [value]
  )

  const filteredAirports = React.useMemo(() => {
    if (!search) return airports
    const lowerSearch = search.toLowerCase()
    return airports.filter((airport) => 
      airport.city.toLowerCase().includes(lowerSearch) ||
      airport.code.toLowerCase().includes(lowerSearch) ||
      airport.name.toLowerCase().includes(lowerSearch) ||
      airport.country.toLowerCase().includes(lowerSearch)
    )
  }, [search])

  const handleSelect = (code: string) => {
    onChange(code)
    setOpen(false)
  }

  return (
    <>
      {name && <input type="hidden" name={name} value={value} />}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between font-normal h-12 text-base md:text-sm", className)}
          >
            {selectedAirport ? (
              <div className="flex items-center text-left">
                <Plane className="mr-2 h-4 w-4 text-blue-600" />
                <div className="flex flex-col">
                  <span className="font-bold leading-none">{selectedAirport.city} ({selectedAirport.code})</span>
                  <span className="text-xs text-muted-foreground mt-0.5">{selectedAirport.name}</span>
                </div>
              </div>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] sm:w-[350px] p-0" align="start">
          <div className="flex flex-col w-full bg-popover text-popover-foreground rounded-md">
            {/* Search Input */}
            <div className="flex items-center border-b px-3 py-2">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <input
              className="flex h-9 w-full rounded-md bg-transparent py-3 text-base md:text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Buscar cidade, código ou país..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
              {search && (
                <button onClick={() => setSearch("")} type="button">
                  <X className="h-4 w-4 opacity-50 hover:opacity-100" />
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-[300px] overflow-y-auto p-1">
              {filteredAirports.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  Nenhum aeroporto encontrado.
                </div>
              ) : (
                filteredAirports.map((airport) => (
                  <div
                    key={airport.code}
                    onClick={() => handleSelect(airport.code)}
                    className={cn(
                      "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground transition-colors",
                      value === airport.code && "bg-accent text-accent-foreground"
                    )}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === airport.code ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{airport.city}</span>
                        <span className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-mono">{airport.code}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{airport.name} • {airport.country}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  )
}