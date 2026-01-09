'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import fs from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'

export async function updateProfile(formData: FormData) {
  const session = await auth()
  if (!session?.user?.email) {
    throw new Error('Não autenticado')
  }

  const name = formData.get('name') as string
  const pixKey = formData.get('pixKey') as string
  const file = formData.get('avatar') as File | null

  let avatarUrl = undefined

  if (file && file.size > 0) {
    const buffer = Buffer.from(await file.arrayBuffer())
    // Sanitizar nome do arquivo
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '')
    const filename = `${randomUUID()}-${safeName}`
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    
    try {
        await fs.mkdir(uploadDir, { recursive: true })
        await fs.writeFile(path.join(uploadDir, filename), buffer)
        avatarUrl = `/uploads/${filename}`
    } catch (e) {
        console.error('Upload error', e)
        throw new Error('Erro ao salvar imagem')
    }
  }

  await prisma.user.update({
    where: { email: session.user.email },
    data: {
      name,
      pixKey,
      ...(avatarUrl ? { avatarUrl } : {})
    }
  })

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/profile')
  return { success: true }
}

export async function getProfile() {
    const session = await auth()
    if (!session?.user?.email) return null
    
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
            id: true,
            name: true,
            email: true,
            pixKey: true,
            avatarUrl: true,
            ratingsReceived: {
                select: {
                    value: true
                }
            }
        }
    })

    if (!user) return null

    // Calcular média
    const totalRating = user.ratingsReceived.reduce((acc, curr) => acc + curr.value, 0)
    const averageRating = user.ratingsReceived.length > 0 
        ? totalRating / user.ratingsReceived.length 
        : 0

    return {
        ...user,
        averageRating,
        ratingCount: user.ratingsReceived.length
    }
}

export async function getUserBalance() {
  try {
    const session = await auth()
    if (!session?.user?.email) return null
    
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { wallet: true }
    })
    
    return user?.wallet?.balance || 0
  } catch (error) {
    console.error('Error in getUserBalance:', error)
    return null
  }
}

export async function getUserWallet() {
  try {
    const session = await auth()
    if (!session?.user?.email) return null
    
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { wallet: true }
    })
    
    return user?.wallet
  } catch (error) {
    console.error('Error in getUserWallet:', error)
    return null
  }
}

export async function requestWithdrawal(amount: number, pixKey: string, pixKeyType: string) {
    const session = await auth()
    if (!session?.user?.email) throw new Error('Não autenticado')

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { wallet: true }
    })

    if (!user?.wallet) throw new Error('Carteira não encontrada')
    if (user.wallet.balance < amount) throw new Error('Saldo insuficiente')

    await prisma.$transaction([
        prisma.wallet.update({
            where: { id: user.wallet.id },
            data: { balance: { decrement: amount } }
        }),
        prisma.financialTransaction.create({
            data: {
                type: 'WITHDRAWAL',
                amount: amount,
                status: 'COMPLETED', // Em prod seria PENDING até processar
                walletId: user.wallet.id,
                description: `Saque para chave PIX (${pixKeyType}): ${pixKey}`
            }
        })
    ])

    revalidatePath('/dashboard')
    return { success: true }
}
