"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const passengerSchema = z.object({
  firstName: z.string().min(2, "Nome muito curto"),
  lastName: z.string().min(2, "Sobrenome muito curto"),
  birthDate: z.string().transform((str) => new Date(str)).refine((date) => {
    const year = date.getFullYear()
    return year > 1900 && year <= new Date().getFullYear() + 1
  }, "Ano de nascimento inválido"),
  gender: z.enum(["MALE", "FEMALE"]),
  nationality: z.string().default("Brasileira"),
  documentType: z.enum(["CPF", "PASSPORT"]).default("CPF"),
  documentNumber: z.string().min(1, "Número do documento obrigatório"),
  passportExpiry: z.string().optional().transform((str) => str ? new Date(str) : null),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  cpf: z.string().optional(),
})

const savePassengersSchema = z.object({
  flightRequestId: z.string(),
  passengers: z.array(passengerSchema),
})

export async function savePassengers(rawData: z.input<typeof savePassengersSchema>) {
  const session = await auth()
  if (!session?.user?.email) {
    throw new Error("Não autenticado")
  }

  // Validar e transformar dados
  const data = savePassengersSchema.parse(rawData)
  const { flightRequestId, passengers } = data

  console.log("Recebendo passageiros:", JSON.stringify(passengers, null, 2))

  // Verificar se o request pertence ao usuário
  const flightRequest = await prisma.flightRequest.findUnique({
    where: { id: flightRequestId },
    include: { buyer: true }
  })

  if (!flightRequest) {
    throw new Error("Pedido não encontrado")
  }

  if (flightRequest.buyer.email !== session.user.email) {
    throw new Error("Não autorizado")
  }

  // Verificar status (opcional, mas bom pra garantir integridade)
  // Geralmente só permitimos salvar se estiver PAGO ou AGUARDANDO_EMISSAO
  // Mas como estamos criando agora, vamos deixar flexível ou verificar se já não foi emitido
  if (flightRequest.status === "COMPLETED" || flightRequest.status === "ISSUED") {
     throw new Error("Não é possível alterar passageiros de um pedido já emitido/concluído")
  }

  try {
    // Apagar passageiros antigos se houver (update completo) ou criar novos
    // Vamos usar transaction
    await prisma.$transaction(async (tx) => {
      // Remove existing passengers for this request to avoid duplicates if re-submitting
      await tx.passenger.deleteMany({
        where: { flightRequestId }
      })

      // Create new passengers
      await tx.passenger.createMany({
        data: passengers.map(p => ({
          firstName: p.firstName,
          lastName: p.lastName,
          birthDate: p.birthDate,
          gender: p.gender,
          nationality: p.nationality,
          documentType: p.documentType,
          documentNumber: p.documentNumber,
          passportExpiry: p.passportExpiry,
          email: p.email || null,
          phone: p.phone || null,
          cpf: p.documentType === 'CPF' ? p.documentNumber : p.cpf,
          flightRequestId
        }))
      })
    })

    revalidatePath(`/dashboard/my-requests/${flightRequestId}`)
    revalidatePath('/dashboard/my-requests')
    
    return { success: true }
  } catch (error) {
    console.error("Erro ao salvar passageiros (Detalhes):", error)
    // Se for erro do Zod ou Prisma, tente extrair mensagem
    const message = error instanceof Error ? error.message : "Erro desconhecido"
    throw new Error(`Falha ao salvar dados: ${message}`)
  }
}

export async function getPassengers(flightRequestId: string) {
    const session = await auth()
    if (!session?.user?.email) return []

    // Validação de acesso seria ideal aqui também
    
    const passengers = await prisma.passenger.findMany({
        where: { flightRequestId }
    })

    return passengers
}
