'use client'

import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { getUserBalance } from '@/app/actions/user'
import { User, LogOut } from 'lucide-react'

export function Navbar({ user }: { user: any }) {
  const [balance, setBalance] = useState<number | null>(null)

  useEffect(() => {
    if (user?.email) {
      getUserBalance()
        .then((val) => {
          if (typeof val === 'number') setBalance(val)
        })
        .catch((err) => {
          console.error('Failed to fetch balance:', err)
        })
    }
  }, [user])

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image 
            src="/logo-facilmilha.png" 
            alt="FacilMilha Logo" 
            width={180} 
            height={50} 
            className="h-10 w-auto object-contain"
          />
        </Link>
        
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="text-sm hidden md:block">
                <span className="text-muted-foreground">Olá, </span>
                <span className="font-semibold">{user.name || user.email}</span>
              </div>
              
              {balance !== null && balance > 0 && (
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                  R$ {balance.toFixed(2)}
                </div>
              )}

              <Link href="/dashboard/profile">
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline">Perfil</span>
                </Button>
              </Link>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline">Sair</span>
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button>Entrar</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
