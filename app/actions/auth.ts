'use server'

// Auth actions
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { signIn } from '@/auth'
import { AuthError } from 'next-auth'

const RegisterSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  pixKey: z.string().optional(),
})

export async function registerUser(prevState: string | undefined, formData: FormData) {
  const data = Object.fromEntries(formData.entries())
  const parsed = RegisterSchema.safeParse(data)

  if (!parsed.success) {
    return 'Campos inválidos. Verifique os dados.'
  }

  const { name, email, password, pixKey } = parsed.data

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return 'Email já cadastrado.'
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        pixKey: pixKey || null,
        wallet: {
            create: {
                balance: 0,
                frozen: 0
            }
        }
      }
    })

  } catch (error) {
    console.error('Registration error:', error)
    return 'Erro ao criar conta. Tente novamente.'
  }

  // Auto login após registro não é suportado diretamente com credenciais facilmente sem redirecionar,
  // mas podemos redirecionar para login ou tentar sign in.
  // Vamos redirecionar para login por simplicidade.
  // return redirect('/login') -> Actions devem retornar dados ou redirect.
  // Vamos retornar sucesso e o componente client redireciona.
  return 'success'
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Credenciais inválidas.';
        default:
          return 'Algo deu errado.';
      }
    }
    throw error;
  }
}
