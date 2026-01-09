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
            <Card className="mb-6 border-red-200 bg-red-50 shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-4">
                <div className="p-4 flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-red-100 p-2 rounded-full">
                            <AlertCircle className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-red-900">Tempo de reserva esgotado</h3>
                            <p className="text-sm text-red-700">
                                A oferta para {origin} ➔ {destination} pode ter expirado.
                            </p>
                        </div>
                    </div>
                    <Link href={`/checkout/${offerId}`}>
                        <Button variant="destructive" className="whitespace-nowrap">
                            Tentar Pagar Mesmo Assim
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </Card>
        )
    }

    return (
        <Card className="mb-6 border-amber-200 bg-amber-50 shadow-md overflow-hidden relative animate-in fade-in slide-in-from-top-4">
             {/* Progress Bar Background */}
            <div 
                className="absolute bottom-0 left-0 h-1 bg-amber-400 transition-all duration-1000 ease-linear"
                style={{ width: `${progress}%` }}
            />

            <div className="p-4 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                    <div className="bg-amber-100 p-3 rounded-full animate-pulse">
                        <Clock className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-amber-900 text-lg flex items-center gap-2">
                            Pagamento Pendente
                            <span className="text-amber-600 font-mono text-xl bg-amber-100 px-2 rounded">
                                {timeLeft}
                            </span>
                        </h3>
                        <p className="text-sm text-amber-800">
                            Finalize a reserva para <strong>{origin} ➔ {destination}</strong> antes que expire.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                     <div className="text-right hidden sm:block">
                        <p className="text-xs text-amber-700 uppercase font-semibold">Total a pagar</p>
                        <p className="text-xl font-bold text-emerald-700">R$ {price.toFixed(2)}</p>
                    </div>
                    <Link href={`/checkout/${offerId}`}>
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5">
                            Pagar Agora
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </Link>
                </div>
            </div>
        </Card>
    )
}
