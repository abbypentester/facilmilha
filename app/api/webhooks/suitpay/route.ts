import { NextResponse } from 'next/server'
import { confirmPayment } from '@/app/actions/flight'

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    console.log("🔔 [SuitPay Webhook] Recebido:", JSON.stringify(payload, null, 2))

    // Extrair dados com fallback para garantir robustez
    const typeTransaction = payload.typeTransaction?.toUpperCase() || ''
    const statusTransaction = payload.statusTransaction?.toUpperCase() || ''
    const requestNumber = payload.requestNumber
    const idTransaction = payload.idTransaction || 'unknown_tx_id'

    console.log(`🔍 [SuitPay Webhook] Analisando: Tipo=${typeTransaction}, Status=${statusTransaction}, ID=${requestNumber}`)

    // Verifica se é um pagamento PIX confirmado
    // Aceita 'PIX' e status 'PAID_OUT' conforme documentação
    if (typeTransaction === 'PIX' && statusTransaction === 'PAID_OUT') {
      
      if (requestNumber) {
        console.log(`✅ [SuitPay Webhook] Confirmando pagamento para Oferta ID: ${requestNumber}`)
        
        try {
            const startTime = Date.now()
            const result = await confirmPayment(requestNumber, idTransaction)
            const duration = Date.now() - startTime
            
            if (result.success) {
                console.log(`🎉 [SuitPay Webhook] Pagamento confirmado com sucesso em ${duration}ms!`)
            } else {
                console.error(`❌ [SuitPay Webhook] Falha ao confirmar pagamento (Duration: ${duration}ms).`)
            }
        } catch (processError) {
            console.error(`❌ [SuitPay Webhook] Exception ao processar pagamento:`, processError)
        }
        
      } else {
        console.warn("⚠️ [SuitPay Webhook] Recebido sem requestNumber (Offer ID). Impossível vincular ao pedido.")
      }
    } else {
        console.log(`ℹ️ [SuitPay Webhook] Ignorando evento. Motivo: Status não é PAID_OUT ou Tipo não é PIX.`)
    }

    // Retorna 200 OK para a SuitPay não ficar tentando reenviar em loop caso seja um evento que não nos interessa
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("❌ [SuitPay Webhook] Erro crítico no processamento:", error)
    // Retorna 200 mesmo em erro para evitar retry loop infinito da SuitPay se for erro de lógica nossa
    // Mas loga o erro no servidor
    return NextResponse.json({ received: true, error: 'Internal Processing Error' }, { status: 200 })
  }
}

export async function GET() {
  return NextResponse.json({ status: 'active', message: 'SuitPay Webhook Endpoint is running' })
}
