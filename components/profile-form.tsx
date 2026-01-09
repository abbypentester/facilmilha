'use client'

import { useState, useRef } from 'react'
import { updateProfile } from '@/app/actions/user'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Camera, Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'

interface ProfileFormProps {
  user: {
    name: string | null
    email: string
    pixKey: string | null
    avatarUrl: string | null
  }
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(user.avatarUrl)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPreview(url)
    }
  }

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    try {
      await updateProfile(formData)
      toast.success("Perfil atualizado!", {
        description: "Suas alterações foram salvas com sucesso.",
      })
    } catch (error) {
      toast.error("Erro ao atualizar", {
        description: "Ocorreu um erro ao salvar suas alterações.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Pessoais</CardTitle>
        <CardDescription>Atualize sua foto e dados pessoais.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
                <AvatarImage src={preview || ""} className="object-cover" />
                <AvatarFallback className="text-4xl bg-slate-100">
                  {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="text-white h-8 w-8" />
              </div>
            </div>
            <input 
              type="file" 
              name="avatar" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
            <p className="text-sm text-muted-foreground">Clique na foto para alterar</p>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input id="name" name="name" defaultValue={user.name || ""} placeholder="Seu nome" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user.email} disabled className="bg-slate-50" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="pixKey">Chave PIX</Label>
              <Input id="pixKey" name="pixKey" defaultValue={user.pixKey || ""} placeholder="CPF, Email ou Telefone" />
              <p className="text-xs text-muted-foreground">Usada para receber pagamentos de suas vendas.</p>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Alterações
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
