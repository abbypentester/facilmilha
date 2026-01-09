'use server'

// Actions for Flight Requests and Offers
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// --- Utils ---
async function getSessionUser() {
  const session = await auth()
  if (!session?.user?.email) redirect('/')
  
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { wallet: true }
  })
  
  if (!user) {
    // Se o usuário tem sessão mas não existe no banco (ex: reset do banco), redireciona para login/home
    console.log("Sessão órfã detectada (usuário não encontrado). Redirecionando para signout.")
    redirect('/api/auth/signout')
  }
  return user
}

// --- Requests ---

export async function createFlightRequest(formData: FormData) {
  const user = await getSessionUser()
  
  const origin = formData.get('origin') as string
  const destination = formData.get('destination') as string
  const dateStr = formData.get('date') as string
  const flexibility = formData.get('flexibility') === 'on'
  const observation = formData.get('observation') as string
  const tripType = formData.get('tripType') as string
  const returnDateStr = formData.get('returnDate') as string
  const passengersCount = parseInt(formData.get('passengersCount') as string || '1')

  console.log('Creating Flight Request:', {
    origin, destination, dateStr, returnDateStr, tripType, passengersCount
  })

  if (!origin || !destination || !dateStr) {
    throw new Error('Campos obrigatórios faltando')
  }

  const departDate = new Date(dateStr)
  if (isNaN(departDate.getTime())) {
      throw new Error('Data de ida inválida')
  }
  
  let returnDate: Date | null = null
  if (returnDateStr) {
      returnDate = new Date(returnDateStr)
      if (isNaN(returnDate.getTime())) {
          throw new Error('Data de volta inválida')
      }
  }

  try {
    await prisma.flightRequest.create({
        data: {
        origin,
        destination,
        departDate,
        returnDate,
        tripType: tripType || 'ONE_WAY',
        passengersCount,
        flexibility,
        observation,
        buyerId: user.id,
        status: 'OPEN'
        }
    })
  } catch (e) {
      console.error('Error creating flight request:', e)
      throw e
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function getOpenRequests() {
  const session = await auth()
  // Não mostrar meus próprios pedidos na lista de vendas
  const myEmail = session?.user?.email
  
  return await prisma.flightRequest.findMany({
    where: { 
        status: 'OPEN',
        // Para testes, vamos permitir ver os próprios pedidos
        // buyer: { email: { not: myEmail || '' } } 
    },
    include: { 
      buyer: { select: { name: true, id: true } },
      offers: true 
    },
    orderBy: { createdAt: 'desc' }
  })
}

export async function getMyRequests() {
  const user = await getSessionUser()
  return await prisma.flightRequest.findMany({
    where: { buyerId: user.id },
    include: { 
        offers: { 
            include: { 
                seller: { 
                  select: { 
                    name: true,
                    avatarUrl: true,
                    ratingsReceived: { select: { value: true } }
                  } 
                },
                rating: true 
            } 
        },
        passengers: true
    },
    orderBy: { createdAt: 'desc' }
  })
}

export async function getMySales() {
  const user = await getSessionUser()
  // Vendas onde fiz oferta
  const sales = await prisma.offer.findMany({
    where: { sellerId: user.id },
    include: { 
        flightRequest: {
            include: {
                passengers: true
            }
        } 
    },
    orderBy: { createdAt: 'desc' }
  })

  // SEGURANÇA: Remover dados sensíveis dos passageiros se o pagamento não estiver confirmado
  return sales.map(sale => {
      const isPaymentConfirmed = ['PAID_BY_BUYER', 'TICKET_ISSUED', 'COMPLETED'].includes(sale.status)
      
      if (!isPaymentConfirmed) {
          // Limpa o array de passageiros para não enviar dados sensíveis ao frontend
          // O frontend já não exibe nada se o status não for pago, mas isso garante que os dados nem cheguem lá
          sale.flightRequest.passengers = []
      }
      
      return sale
  })
}

// --- Offers ---

export async function createOffer(requestId: string, amount: number, emissionDeadline: string, observation: string, airline: string) {
  const user = await getSessionUser()
  
  const feePercentage = 0.15
  const feeBuyer = amount * feePercentage
  const feeSeller = amount * feePercentage
  const totalPrice = amount + feeBuyer
  const netAmount = amount - feeSeller
  
  await prisma.offer.create({
    data: {
      amount,
      feeBuyer,
      feeSeller,
      totalPrice,
      netAmount,
      emissionDeadline,
      observation,
      airline,
      status: 'PENDING',
      flightRequestId: requestId,
      sellerId: user.id
    }
  })
  
  revalidatePath('/dashboard')
  return { success: true }
}

// --- Payment & Flow ---

export async function acceptOffer(offerId: string) {
  const user = await getSessionUser()
  
  const offer = await prisma.offer.findUnique({ 
    where: { id: offerId },
    include: { flightRequest: true }
  })
  
  if (!offer) throw new Error('Oferta não encontrada')
  if (offer.flightRequest.buyerId !== user.id) throw new Error('Não autorizado')

  // Iniciar transação: Bloquear oferta e pedido
  await prisma.$transaction([
    prisma.offer.update({
      where: { id: offerId },
      data: { status: 'ACCEPTED' }
    }),
    prisma.flightRequest.update({
      where: { id: offer.flightRequestId },
      data: { status: 'OFFER_ACCEPTED' }
    })
  ])

  // Retornar ID para redirecionar ao checkout
  return { success: true, checkoutUrl: `/checkout/${offerId}` }
}

export async function cancelFlightRequest(requestId: string) {
  try {
    const user = await getSessionUser()

    const request = await prisma.flightRequest.findUnique({
      where: { id: requestId },
      include: { offers: true }
    })

    if (!request) return { success: false, error: 'Solicitação não encontrada' }
    if (request.buyerId !== user.id) return { success: false, error: 'Não autorizado' }

    // Regra: Só pode cancelar se não estiver pago
    // Status que indicam pagamento/emissão: PAID, ISSUED, COMPLETED
    const nonCancellableStatuses = ['PAID', 'ISSUED', 'COMPLETED']
    
    if (nonCancellableStatuses.includes(request.status)) {
      return { success: false, error: 'Não é possível cancelar uma solicitação já paga ou concluída' }
    }
    
    await prisma.flightRequest.update({
      where: { id: requestId },
      data: { status: 'CANCELED' }
    })

    revalidatePath('/dashboard')
    return { success: true }
  } catch (error: any) {
    if (error.digest?.startsWith('NEXT_REDIRECT')) {
        throw error;
    }
    console.error('Error canceling request:', error)
    return { success: false, error: 'Erro ao processar cancelamento. Tente novamente.' }
  }
}


export async function confirmPayment(offerId: string, transactionId: string) {
  const offer = await prisma.offer.findUnique({
      where: { id: offerId },
      include: { seller: { include: { wallet: true } } }
  })
  
  if (!offer) {
      console.error(`Oferta ${offerId} não encontrada para confirmação de pagamento.`)
      return { success: false }
  }

  if (offer.status === 'PAID_BY_BUYER' || offer.status === 'TICKET_ISSUED') {
      console.log(`Oferta ${offerId} já está paga.`)
      return { success: true }
  }
  
  // Atualiza status
  await prisma.$transaction([
      prisma.offer.update({
          where: { id: offerId },
          data: { status: 'PAID_BY_BUYER' }
      }),
      prisma.flightRequest.update({
          where: { id: offer.flightRequestId },
          data: { status: 'PAID' }
      }),
      // Opcional: Salvar o ID da transação do gateway em algum lugar se tivermos tabela para isso
  ])
  
  console.log(`Pagamento confirmado para oferta ${offerId}. TransactionID: ${transactionId}`)
  revalidatePath(`/checkout/${offerId}`)
  revalidatePath('/dashboard')
  return { success: true }
}

export async function simulatePixPayment(offerId: string) {
  // Mantendo para retrocompatibilidade ou testes manuais se necessário
  return confirmPayment(offerId, "SIMULATED_" + Date.now())
}

import { createPixCharge, executePixCashOut } from '@/lib/suitpay'

export async function generatePixForOffer(offerId: string, cpf: string) {
    const user = await getSessionUser()
    const offer = await prisma.offer.findUnique({
        where: { id: offerId },
        include: { 
            flightRequest: { 
                include: { 
                    buyer: true,
                    passengers: true 
                } 
            } 
        }
    })

    if (!offer) throw new Error("Oferta não encontrada")

    try {
        // Data de vencimento: Hoje + 1 dia
        const dueDate = new Date()
        dueDate.setDate(dueDate.getDate() + 1)
        const dueDateStr = dueDate.toISOString().split('T')[0]
        
        const passenger = offer.flightRequest.passengers[0]
        const phone = passenger?.phone || ''

        const pixData = await createPixCharge({
            requestNumber: offer.id,
            dueDate: dueDateStr,
            amount: offer.totalPrice,
            client: {
                name: offer.flightRequest.buyer.name || 'Cliente FacilMilha',
                email: offer.flightRequest.buyer.email,
                document: cpf.replace(/\D/g, ''),
                phoneNumber: phone
            }
        })
        
        // Salva na oferta
        await prisma.offer.update({
            where: { id: offer.id },
            data: {
                pixCode: pixData.paymentCode,
                pixImage: pixData.paymentCodeBase64,
                paymentId: pixData.idTransaction
            }
        })

        return { 
            success: true, 
            pixCode: pixData.paymentCode, 
            pixImage: pixData.paymentCodeBase64 
        }

    } catch (e: any) {
        console.error("Erro ao gerar PIX manual:", e)
        return { success: false, error: e.message || "Erro ao gerar PIX" }
    }
}

// --- Fulfillment ---

export async function submitProof(offerId: string, proofUrl: string, pnr: string) {
    const cleanPnr = pnr.trim().toUpperCase()
    
    // Validação Nível 1: Padrão 6 caracteres alfanuméricos
    if (!/^[A-Z0-9]{6}$/.test(cleanPnr)) {
        throw new Error("O Localizador (PNR) deve ter exatamente 6 caracteres alfanuméricos.")
    }

    // Vendedor envia comprovante
    await prisma.offer.update({
        where: { id: offerId },
        data: { 
            status: 'TICKET_ISSUED',
            proofUrl,
            pnr: cleanPnr
        }
    })
    
    const offer = await prisma.offer.findUnique({where: {id: offerId}})
    await prisma.flightRequest.update({
        where: { id: offer?.flightRequestId },
        data: { status: 'ISSUED' }
    })
    
    revalidatePath('/dashboard')
    return { success: true }
}

export async function confirmReceipt(offerId: string) {
    // Comprador confirma que recebeu e voou (ou recebeu bilhete válido)
    // Libera o dinheiro do Frozen -> Balance do Vendedor (com 5 dias de hold)
    
    try {
        const user = await getSessionUser()

        const offer = await prisma.offer.findUnique({
            where: { id: offerId },
            include: { 
                seller: { include: { wallet: true } },
                flightRequest: true
            }
        })
        
        if (!offer || !offer.seller.wallet) throw new Error('Erro processando carteira')
        if (offer.flightRequest.buyerId !== user.id) throw new Error('Não autorizado')
        
        // 5 dias de segurança (MED)
        const releaseDate = new Date()
        releaseDate.setDate(releaseDate.getDate() + 5)

        await prisma.$transaction([
            // 1. Atualiza status finais
            prisma.offer.update({
                where: { id: offerId },
                data: { status: 'COMPLETED' }
            }),
            prisma.flightRequest.update({
                where: { id: offer.flightRequestId },
                data: { status: 'COMPLETED' }
            }),
            // 2. Credita valor em PENDING (segurança)
            prisma.wallet.update({
                where: { id: offer.seller.wallet.id },
                data: { 
                    pending: { increment: offer.netAmount } 
                }
            }),
            // 3. Registra transação
            prisma.financialTransaction.create({
                data: {
                    type: 'SALE_HOLD',
                    amount: offer.netAmount,
                    status: 'PENDING',
                    availableAt: releaseDate,
                    walletId: offer.seller.wallet.id,
                    description: `Venda #${offer.flightRequestId.slice(0,6)} (Libera em 5 dias)`
                }
            })
        ])
        
        revalidatePath('/dashboard')
        return { success: true }
    } catch (error: any) {
        if (error.digest?.startsWith('NEXT_REDIRECT')) {
            throw error;
        }
        console.error("Erro ao confirmar recebimento:", error)
        return { success: false, error: 'Erro ao confirmar recebimento.' }
    }
}

export async function rateSeller(offerId: string, rating: number, comment: string) {
    const user = await getSessionUser() // Comprador

    const offer = await prisma.offer.findUnique({
        where: { id: offerId }
    })
    
    if (!offer) throw new Error('Oferta não encontrada')

    const existingRating = await prisma.rating.findUnique({
        where: { offerId }
    })
    
    if (existingRating) {
        throw new Error('Você já avaliou esta oferta.')
    }
    
    await prisma.rating.create({
        data: {
            value: rating,
            comment,
            offerId,
            sellerId: offer.sellerId,
            buyerId: user.id
        }
    })
    
    revalidatePath('/dashboard')
    return { success: true }
}

export async function checkPendingFunds() {
    try {
        const user = await getSessionUser()
        // Permite verificar fundos de qualquer usuário se for admin ou sistema (TODO: Refinar permissões)
        // Por enquanto, foca na carteira do usuário logado ou varredura geral se chamado por Cron
        
        if (!user.wallet) return { released: 0 }

        const now = new Date()
        
        // Buscar transações pendentes vencidas
        const pendingTx = await prisma.financialTransaction.findMany({
            where: {
                walletId: user.wallet.id,
                status: 'PENDING',
                availableAt: { lte: now }
            }
        })
        
        if (pendingTx.length === 0) return { released: 0 }
        
        const walletId = user.wallet.id
        let totalReleased = 0
        
        // Processa cada transação individualmente para garantir Cash Out
        for (const t of pendingTx) {
             // 1. Tenta fazer o Cash Out na SuitPay primeiro
             // Precisamos da chave PIX do usuário.
             const pixKey = user.pixKey
             if (!pixKey) {
                 console.warn(`Usuário ${user.email} não tem chave PIX cadastrada para receber ${t.amount}. Mantendo pendente.`)
                 continue 
             }
             
             // Identificar tipo de chave (simplificado)
             let typeKey: 'email' | 'document' | 'phoneNumber' | 'randomKey' = 'email'
             if (pixKey.includes('@')) typeKey = 'email'
             else if (pixKey.length === 11 || pixKey.length === 14) typeKey = 'document'
             else if (pixKey.length > 20) typeKey = 'randomKey'
             else typeKey = 'phoneNumber' // Assumindo telefone se não for os outros

             // Dispara Cash Out
             const cashOutResult = await executePixCashOut({
                 key: pixKey,
                 typeKey: typeKey,
                 value: t.amount,
                 externalId: t.id // Idempotência baseada no ID da transação
             })
             
             if (cashOutResult.success) {
                 // 2. Se sucesso, atualiza BD
                 await prisma.$transaction([
                    prisma.financialTransaction.update({
                        where: { id: t.id },
                        data: { 
                            status: 'COMPLETED',
                            description: `${t.description} (PIX Enviado: ${cashOutResult.data?.idTransaction})`
                        }
                    }),
                    prisma.wallet.update({
                        where: { id: walletId },
                        data: {
                            // Não soma no balance pois já foi enviado pra conta bancária
                            // balance: { increment: t.amount }, 
                            pending: { decrement: t.amount }
                        }
                    })
                 ])
                 totalReleased += t.amount
             } else {
                 console.error(`Falha no Cash Out da transação ${t.id}:`, cashOutResult.error)
                 // Mantém PENDING para tentar novamente depois
             }
        }
        
        revalidatePath('/dashboard')
        return { released: totalReleased }
    } catch (error: any) {
        if (error.message === 'NEXT_REDIRECT' || error?.digest?.startsWith('NEXT_REDIRECT')) {
            throw error
        }
        console.error("Erro ao verificar fundos pendentes:", error)
        return { released: 0, error: 'Failed to check pending funds' }
    }
}
