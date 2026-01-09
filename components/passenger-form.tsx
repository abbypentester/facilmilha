"use client"

import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "sonner"
import { savePassengers } from "@/app/actions/passenger"
import { Loader2, Plus, Trash2, User } from "lucide-react"

const passengerSchema = z.object({
  firstName: z.string().min(2, "Nome obrigatório"),
  lastName: z.string().min(2, "Sobrenome obrigatório"),
  birthDate: z.string().refine((val) => {
    const date = new Date(val)
    const year = date.getFullYear()
    const currentYear = new Date().getFullYear()
    return !isNaN(date.getTime()) && year > 1900 && year <= currentYear
  }, {
    message: "Data inválida (verifique o ano)",
  }),
  gender: z.enum(["MALE", "FEMALE"]),
  nationality: z.string().min(2, "Nacionalidade obrigatória"),
  documentType: z.enum(["CPF", "PASSPORT"]),
  documentNumber: z.string().min(1, "Número do documento obrigatório"),
  passportExpiry: z.string().optional(),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
  cpf: z.string().optional(), // Mantido para compatibilidade, mas não exibido
})

const formSchema = z.object({
  passengers: z.array(passengerSchema).min(1, "Adicione pelo menos um passageiro"),
})

type FormValues = z.infer<typeof formSchema>

interface PassengerFormProps {
  flightRequestId: string
  onSuccess?: () => void
}

export function PassengerForm({ flightRequestId, onSuccess }: PassengerFormProps) {
  const [loading, setLoading] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      passengers: [
        { 
          firstName: "", 
          lastName: "", 
          birthDate: "", 
          gender: "MALE",
          nationality: "Brasileira",
          documentType: "CPF",
          documentNumber: "",
          email: "",
          phone: ""
        }
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "passengers",
  })

  const onSubmit = async (data: FormValues) => {
    setLoading(true)
    try {
      await savePassengers({
        flightRequestId,
        passengers: data.passengers,
      })
      toast.success("Dados salvos com sucesso!")
      if (onSuccess) onSuccess()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao salvar dados")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full border-0 shadow-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Dados dos Passageiros</CardTitle>
        <CardDescription>
          Preencha os dados exatamente como constam no documento de viagem.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {fields.map((field, index) => {
             // Watch documentType for conditional rendering
             const docType = watch(`passengers.${index}.documentType`)

             return (
            <div key={field.id} className="p-4 border rounded-lg space-y-4 bg-slate-50 relative">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium flex items-center gap-2 text-blue-800">
                  <User className="h-4 w-4" />
                  Passageiro {index + 1}
                </h4>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Linha 1: Nome, Sobrenome, Nascimento, Gênero */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`passengers.${index}.firstName`}>Nome</Label>
                  <Input
                    {...register(`passengers.${index}.firstName`)}
                    placeholder="Primeiro nome"
                  />
                  {errors.passengers?.[index]?.firstName && (
                    <p className="text-xs text-red-500">{errors.passengers[index]?.firstName?.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`passengers.${index}.lastName`}>Sobrenome</Label>
                  <Input
                    {...register(`passengers.${index}.lastName`)}
                    placeholder="Sobrenome completo"
                  />
                  {errors.passengers?.[index]?.lastName && (
                    <p className="text-xs text-red-500">{errors.passengers[index]?.lastName?.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`passengers.${index}.birthDate`}>Nascimento</Label>
                  <Input
                    type="date"
                    {...register(`passengers.${index}.birthDate`)}
                  />
                  {errors.passengers?.[index]?.birthDate && (
                    <p className="text-xs text-red-500">{errors.passengers[index]?.birthDate?.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`passengers.${index}.gender`}>Gênero</Label>
                  <select
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...register(`passengers.${index}.gender`)}
                  >
                    <option value="MALE">Masculino</option>
                    <option value="FEMALE">Feminino</option>
                  </select>
                </div>
              </div>

              {/* Linha 2: Nacionalidade, Tipo Doc, Numero Doc, Validade (se passaporte) */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                 <div className="space-y-2">
                  <Label htmlFor={`passengers.${index}.nationality`}>Nacionalidade</Label>
                  <Input
                    {...register(`passengers.${index}.nationality`)}
                    placeholder="Ex: Brasileira"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`passengers.${index}.documentType`}>Tipo Documento</Label>
                  <select
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...register(`passengers.${index}.documentType`)}
                  >
                    <option value="CPF">CPF (Nacional)</option>
                    <option value="PASSPORT">Passaporte (Internacional)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`passengers.${index}.documentNumber`}>
                    {docType === 'PASSPORT' ? 'Nº Passaporte' : 'CPF'}
                  </Label>
                  <Input
                    {...register(`passengers.${index}.documentNumber`)}
                    placeholder={docType === 'PASSPORT' ? 'Ex: FL123456' : '000.000.000-00'}
                  />
                  {errors.passengers?.[index]?.documentNumber && (
                    <p className="text-xs text-red-500">{errors.passengers[index]?.documentNumber?.message}</p>
                  )}
                </div>

                {docType === 'PASSPORT' && (
                    <div className="space-y-2 animate-in fade-in zoom-in-95 duration-200">
                    <Label htmlFor={`passengers.${index}.passportExpiry`}>Validade Passaporte</Label>
                    <Input
                        type="date"
                        {...register(`passengers.${index}.passportExpiry`)}
                    />
                    <p className="text-[10px] text-muted-foreground">Mínimo 6 meses</p>
                    </div>
                )}
              </div>

              {/* Linha 3: Contato (Opcional) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`passengers.${index}.email`}>E-mail (Para receber bilhete)</Label>
                  <Input
                    type="email"
                    {...register(`passengers.${index}.email`)}
                    placeholder="email@exemplo.com"
                  />
                  {errors.passengers?.[index]?.email && (
                    <p className="text-xs text-red-500">{errors.passengers[index]?.email?.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`passengers.${index}.phone`}>Telefone / WhatsApp</Label>
                  <Input
                    {...register(`passengers.${index}.phone`)}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

            </div>
          )})}

          <Button
            type="button"
            variant="outline"
            className="w-full border-dashed border-2 hover:bg-slate-50"
            onClick={() => append({ 
                firstName: "", 
                lastName: "", 
                birthDate: "", 
                gender: "MALE",
                nationality: "Brasileira",
                documentType: "CPF",
                documentNumber: "",
                email: "",
                phone: "" 
            })}
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Outro Passageiro
          </Button>

          <div className="pt-4 sticky bottom-0 bg-white pb-4 border-t mt-4">
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando Dados...
                </>
              ) : (
                "Confirmar Dados dos Passageiros"
              )}
            </Button>
            <p className="text-center text-xs text-muted-foreground mt-2">
                Esses dados serão enviados ao milheiro apenas para emissão da passagem.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
