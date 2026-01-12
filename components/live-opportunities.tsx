"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plane, TrendingUp, X } from "lucide-react"
import Link from "next/link"

const MOCK_OFFERS = [
  { id: 1, from: "São Paulo (GRU)", to: "Miami (MIA)", price: "R$ 1.850", miles: "30k" },
  { id: 2, from: "Rio (GIG)", to: "Lisboa (LIS)", price: "R$ 2.400", miles: "45k" },
  { id: 3, from: "Brasília (BSB)", to: "Orlando (MCO)", price: "R$ 1.600", miles: "28k" },
  { id: 4, from: "São Paulo (CGH)", to: "Salvador (SSA)", price: "R$ 450", miles: "12k" },
  { id: 5, from: "Belo Horizonte (CNF)", to: "Paris (CDG)", price: "R$ 2.900", miles: "50k" },
]

export function LiveOpportunities() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % MOCK_OFFERS.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-auto md:max-w-3xl z-50">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-slate-900/95 backdrop-blur-sm text-white rounded-2xl shadow-2xl border border-slate-700 p-4 flex items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3 md:gap-6 flex-1 min-w-0">
          <div className="flex items-center gap-2 text-green-400 shrink-0">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider hidden md:block">Oportunidade Agora</span>
          </div>

          <div className="h-10 w-px bg-slate-700 hidden md:block" />

          <div className="flex-1 relative h-10 overflow-hidden min-w-[200px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center gap-2 md:gap-4 text-sm md:text-base whitespace-nowrap"
              >
                <div className="flex items-center gap-2 text-slate-300">
                  <span>{MOCK_OFFERS[currentIndex].from}</span>
                  <Plane className="w-3 h-3 md:w-4 md:h-4" />
                  <span>{MOCK_OFFERS[currentIndex].to}</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-emerald-400">
                  <span className="bg-emerald-500/10 px-2 py-0.5 rounded text-emerald-300 border border-emerald-500/20">
                    Venda por {MOCK_OFFERS[currentIndex].price}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link href="/register" className="hidden md:block">
            <button className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Vender Milhas
            </button>
          </Link>
          <Link href="/register" className="md:hidden">
            <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors">
              Vender
            </button>
          </Link>
          <button 
            onClick={() => setIsVisible(false)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  )
}
