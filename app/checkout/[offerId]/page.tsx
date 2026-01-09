import React from 'react'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'
import { CheckoutPixForm } from '@/components/checkout-pix-form'

export default async function CheckoutPage({ params }: { params: Promise<{ offerId: string }> }) {
  const { offerId } = await params
  console.log('Rendering CheckoutPage for offer:', offerId)
  
  // Usar try-catch para evitar crash da página se auth falhar
  let session;
  try {
      session = await auth()
      console.log('Session retrieved:', session?.user?.email)
  } catch (error) {
      console.error('Error fetching session:', error)
      redirect('/login')
  }

  if (!session) {
    console.log('No session, redirecting to login')
    redirect('/login')
  }

  const offer = await prisma.offer.findUnique({
    where: { id: offerId },
    include: { 
        flightRequest: {
            include: {
                buyer: true,
                passengers: true
            }
        }, 
        seller: true 
    }
  })

  if (!offer) return <div>Oferta não encontrada</div>

  // Se já estiver pago, redirecionar ou mostrar sucesso
  if (offer.status === 'PAID_BY_BUYER' || offer.status === 'TICKET_ISSUED' || offer.status === 'COMPLETED') {
      return (
          <div className="container mx-auto py-10 flex flex-col items-center">
              <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
              <h1 className="text-2xl font-bold">Pagamento Confirmado!</h1>
              <p className="text-muted-foreground mb-6">O vendedor será notificado para emitir sua passagem.</p>
              <form action={async () => {
                  'use server'
                  redirect('/dashboard')
              }}>
                <Button>Voltar ao Dashboard</Button>
              </form>
          </div>
      )
  }

  return (
    <div className="container mx-auto py-10 max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Pagamento via PIX</CardTitle>
        </CardHeader>
        
        <CheckoutPixForm 
            offer={{
                id: offer.id,
                totalPrice: offer.totalPrice,
                pixCode: offer.pixCode,
                pixImage: offer.pixImage,
                flightRequest: {
                    origin: offer.flightRequest.origin,
                    destination: offer.flightRequest.destination
                }
            }} 
            userEmail={offer.flightRequest.buyer.email}
            userName={offer.flightRequest.buyer.name || ''}
        />
      </Card>
    </div>
  )
}
