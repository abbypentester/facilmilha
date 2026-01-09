'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CardContent, CardFooter } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Copy, RefreshCw, Loader2, AlertCircle } from 'lucide-react'
import { generatePixForOffer } from '@/app/actions/flight'

interface CheckoutPixFormProps {
    offer: any
    userEmail: string
    userName: string
}

export function CheckoutPixForm({ offer, userEmail, userName }: CheckoutPixFormProps) {
    const [cpf, setCpf] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [pixData, setPixData] = useState<{ code: string, image: string } | null>(
        offer?.pixCode ? { code: offer.pixCode, image: offer.pixImage } : null
    )

    if (!offer) return <div>Erro ao carregar dados da oferta.</div>

    const handleGeneratePix = async () => {
        if (!cpf || cpf.replace(/\D/g, '').length !== 11) {
            setError("Por favor, informe um CPF válido (11 dígitos).")
            return
        }
        
        setLoading(true)
        setError(null)
        
        try {
            const result = await generatePixForOffer(offer.id, cpf)
            if (result.success && result.pixCode && result.pixImage) {
                setPixData({
                    code: result.pixCode,
                    image: result.pixImage
                })
            } else {
                setError(result.error || "Erro desconhecido ao gerar PIX")
            }
        } catch (e: any) {
            setError(e.message || "Erro de conexão")
        } finally {
            setLoading(false)
        }
    }

    if (pixData) {
        return (
            <CardContent className="space-y-6">
                <div className="bg-gray-100 p-4 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-2">Valor Total</p>
                    <p className="text-3xl font-bold text-green-600">R$ {offer.totalPrice.toFixed(2)}</p>
                </div>

                <div className="flex justify-center mb-4">
                    <img 
                        src={`data:image/png;base64,${pixData.image}`} 
                        alt="QR Code PIX" 
                        className="w-48 h-48 border rounded-lg"
                    />
                </div>

                <div className="space-y-2">
                    <p className="text-sm font-medium">Copie e Cole (PIX)</p>
                    <div className="flex gap-2">
                        <code className="bg-muted p-2 rounded text-xs break-all flex-1 select-all">
                            {pixData.code}
                        </code>
                        <Button size="icon" variant="outline" onClick={() => navigator.clipboard.writeText(pixData.code)}>
                            <Copy className="w-4 h-4" />
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                        Abra o app do seu banco e escolha "PIX Copia e Cola"
                    </p>
                </div>

                <Separator />
                
                <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                        <span>Origem:</span>
                        <span className="font-semibold">{offer.flightRequest.origin}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Destino:</span>
                        <span className="font-semibold">{offer.flightRequest.destination}</span>
                    </div>
                </div>

                 <Button 
                    variant="outline" 
                    className="w-full mt-4" 
                    onClick={() => window.location.reload()}
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Verificar Pagamento
                </Button>
            </CardContent>
        )
    }

    return (
        <CardContent className="space-y-6">
             <div className="bg-gray-100 p-4 rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-2">Valor a Pagar</p>
                <p className="text-3xl font-bold text-green-600">R$ {offer.totalPrice.toFixed(2)}</p>
            </div>

            <div className="space-y-4">
                <div className="p-4 bg-blue-50 text-blue-800 rounded-md text-sm">
                    <p className="flex items-center gap-2 font-semibold">
                        <AlertCircle className="w-4 h-4" />
                        Informação Necessária
                    </p>
                    <p className="mt-1">
                        Para gerar o PIX com segurança, precisamos do CPF do pagador.
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="cpf">CPF do Pagador</Label>
                    <Input 
                        id="cpf" 
                        placeholder="000.000.000-00" 
                        value={cpf}
                        onChange={(e) => {
                            // Mascara simples de CPF
                            let v = e.target.value.replace(/\D/g, '')
                            if (v.length > 11) v = v.slice(0, 11)
                            setCpf(v)
                        }}
                    />
                    <p className="text-xs text-muted-foreground">Somente números.</p>
                </div>

                {error && (
                    <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <Button 
                    className="w-full bg-green-600 hover:bg-green-700" 
                    onClick={handleGeneratePix}
                    disabled={loading || cpf.length !== 11}
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Gerando PIX...
                        </>
                    ) : (
                        "Gerar PIX para Pagamento"
                    )}
                </Button>
            </div>
        </CardContent>
    )
}
