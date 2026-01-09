'use client'

import React, { useActionState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { registerUser } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button className="w-full" disabled={pending}>
      {pending ? 'Criando conta...' : 'Criar Conta'}
    </Button>
  )
}

export default function RegisterPage() {
  const [state, dispatch, isPending] = useActionState(registerUser, undefined)
  const router = useRouter()

  useEffect(() => {
    if (state === 'success') {
      router.push('/login?registered=true')
    }
  }, [state, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Crie sua conta</CardTitle>
          <CardDescription className="text-center">
            Comece a viajar barato ou lucrar com suas milhas hoje mesmo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={dispatch} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input id="name" name="name" required placeholder="Ex: João Silva" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required placeholder="seu@email.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" name="password" type="password" required minLength={6} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pixKey">Chave PIX (Opcional - Para Vendedores)</Label>
              <Input id="pixKey" name="pixKey" placeholder="CPF, Email ou Aleatória" />
              <p className="text-xs text-muted-foreground">Você pode adicionar depois para receber pagamentos.</p>
            </div>
            
            {state && state !== 'success' && (
              <div className="text-sm text-red-500 font-medium text-center">{state}</div>
            )}
            
            <SubmitButton />
          </form>
          <div className="mt-4 text-center text-sm">
            Já tem uma conta?{' '}
            <Link href="/login" className="text-blue-600 hover:underline">
              Entrar
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
