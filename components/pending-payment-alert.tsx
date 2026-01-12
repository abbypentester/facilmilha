'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertCircle, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface PendingPaymentAlertProps {
    offerId: string
    updatedAt: string | Date
    origin: string
    destination: string
    price: number
}

export function PendingPaymentAlert({ offerId, updatedAt, origin, destination, price }: PendingPaymentAlertProps) {
    const [timeLeft, setTimeLeft] = useState<string>('')
    const [isExpired, setIsExpired] = useState(false)
    const [progress, setProgress] = useState(100)

    useEffect(() => {
        const updateTimer = () => {
            const now = new Date().getTime()
            const acceptedAt = new Date(updatedAt).getTime()
            // 15 minutes in milliseconds
            const deadline = acceptedAt + (15 * 60 * 1000)
            const distance = deadline - now

            if (distance < 0) {
                setTimeLeft("00:00")
                setIsExpired(true)
                setProgress(0)
                return
            }

            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((distance % (1000 * 60)) / 1000)

            setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
            
            // Calculate progress for a visual bar (15 mins = 100%)
            const totalDuration = 15 * 60 * 1000
            const percentage = (distance / totalDuration) * 100
            setProgress(percentage)
        }

        updateTimer()
        const interval = setInterval(updateTimer, 1000)

        return () => clearInterval(interval)
    }, [updatedAt])

    if (isExpired) {
        // Even if expired, we might show it but with a different message
        // For now, let's keep it visible but red
        return (
            <Card className="w-full mb-4 md:mb-6 border-red-200 bg-red-50 shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-4">
                <div className="p-3 md:p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4">
                    <div className="flex items-start gap-3 w-full md:w-auto">
                        <div className="bg-red-100 p-2 rounded-full shrink-0">
                            <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-red-900 text-sm md:text-base truncate">Tempo esgotado</h3>
                            <p className="text-xs md:text-sm text-red-700 leading-tight md:leading-normal line-clamp-2">
                                A oferta para {origin} ➔ {destination} pode ter expirado.
                            </p>
                        </div>
                    </div>
                    <Link href={`/checkout/${offerId}`} className="w-full md:w-auto">
                        <Button variant="destructive" className="w-full md:w-auto whitespace-nowrap h-auto py-2 px-4 text-xs md:text-sm">
                            Tentar Pagar
                            <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 ml-2 shrink-0" />
                        </Button>
                    </Link>
                </div>
            </Card>
        )
    }

    return (
        <Card className="w-full mb-4 md:mb-6 border-amber-200 bg-amber-50 shadow-md overflow-hidden relative animate-in fade-in slide-in-from-top-4">
             {/* Progress Bar Background */}
            <div 
                className="absolute bottom-0 left-0 h-1 bg-amber-400 transition-all duration-1000 ease-linear"
                style={{ width: `${progress}%` }}
            />

            <div className="p-3 md:p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4">
                <div className="flex items-start gap-3 w-full md:w-auto">
                    <div className="bg-amber-100 p-2 md:p-3 rounded-full animate-pulse shrink-0">
                        <Clock className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-amber-900 text-sm md:text-lg flex flex-wrap items-center gap-2">
                            <span className="whitespace-nowrap">Pagamento Pendente</span>
                            <span className="text-amber-600 font-mono text-xs md:text-base bg-amber-100 px-1.5 py-0.5 rounded whitespace-nowrap">
                                {timeLeft}
                            </span>
                        </h3>
                        <p className="text-xs md:text-sm text-amber-800 leading-tight mt-1 line-clamp-2">
                            Garanta sua passagem para <span className="font-semibold">{destination}</span> por <span className="font-bold">R$ {price.toFixed(2)}</span>.
                        </p>
                    </div>
                </div>
                <Link href={`/checkout/${offerId}`} className="w-full md:w-auto">
                    <Button className="w-full md:w-auto bg-amber-600 hover:bg-amber-700 text-white whitespace-nowrap h-auto py-2.5 px-4 text-xs md:text-sm shadow-sm">
                        Pagar Agora
                        <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 ml-2 shrink-0" />
                    </Button>
                </Link>
            </div>
        </Card>
    )
}
