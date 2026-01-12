import React from 'react'
import { getOpenRequests, getMyRequests, getMySales, checkPendingFunds } from '@/app/actions/flight'
import { getUserWallet } from '@/app/actions/user'
import { RequestForm } from '@/components/request-form'
import { MarketplaceList } from '@/components/marketplace-list'
import { MyRequestsList } from '@/components/my-requests-list'
import { MySalesList } from '@/components/my-sales-list'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { WithdrawalDialog } from '@/components/withdrawal-dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function Dashboard() {
  await checkPendingFunds()
  const openRequests = await getOpenRequests()
  const myRequests = await getMyRequests()
  const mySales = await getMySales()
  const wallet = await getUserWallet()

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto p-2 md:p-6 space-y-2 md:space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-1 md:gap-4 mb-2 md:mb-8">
          <div>
            <h1 className="text-lg md:text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Olá, Viajante
            </h1>
          </div>
        </header>
      
      <Tabs defaultValue="travel" className="w-full space-y-2 md:space-y-8">
        <div className="flex justify-center md:justify-start">
          <TabsList className="grid w-full max-w-md grid-cols-2 p-1 bg-gray-100/80 rounded-xl">
            <TabsTrigger 
              value="travel" 
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm transition-all duration-200 font-medium text-xs md:text-sm"
            >
              Viajante <span className="hidden xs:inline ml-1">(Comprar)</span>
            </TabsTrigger>
            <TabsTrigger 
              value="sell"
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm transition-all duration-200 font-medium text-xs md:text-sm"
            >
              Milheiro <span className="hidden xs:inline ml-1">(Vender)</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="travel" className="space-y-4 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid gap-3 md:gap-8 lg:grid-cols-[450px_1fr]">
            <div className="relative w-full overflow-hidden rounded-3xl md:overflow-visible">
              <div className="lg:sticky lg:top-8">
                <RequestForm />
              </div>
            </div>
            <div className="space-y-6 w-full min-w-0">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">Minhas Solicitações</h2>
              </div>
              <MyRequestsList requests={myRequests} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sell" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Carteira Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white shadow-lg border-0 ring-1 ring-gray-100 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                  <CardHeader className="pb-2 relative">
                      <CardDescription className="text-gray-500 font-medium">Saldo Disponível</CardDescription>
                      <div className="flex justify-between items-center mt-2">
                          <CardTitle className="text-4xl font-extrabold text-gray-900">
                              R$ {wallet?.balance?.toFixed(2) ?? '0.00'}
                          </CardTitle>
                          <WithdrawalDialog maxAmount={wallet?.balance || 0} />
                      </div>
                  </CardHeader>
              </Card>

              <Card className="bg-white shadow-lg border-0 ring-1 ring-gray-100 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                  <CardHeader className="pb-2 relative">
                      <div className="flex items-center gap-2">
                          <CardDescription className="text-gray-500 font-medium">A Liberar</CardDescription>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200" title="Proteção contra fraude">
                              5 dias
                          </span>
                      </div>
                      <CardTitle className="text-4xl font-extrabold text-gray-900">
                          R$ {wallet?.pending?.toFixed(2) ?? '0.00'}
                      </CardTitle>
                      <p className="text-[10px] text-gray-400 mt-1">
                          Disponível para saque 5 dias após a viagem.
                      </p>
                  </CardHeader>
              </Card>

              <Card className="bg-white shadow-lg border-0 ring-1 ring-gray-100 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                  <CardHeader className="pb-2 relative">
                      <CardDescription className="text-gray-500 font-medium">Em Garantia (Escrow)</CardDescription>
                      <CardTitle className="text-4xl font-extrabold text-gray-900">
                          R$ {wallet?.frozen?.toFixed(2) ?? '0.00'}
                      </CardTitle>
                  </CardHeader>
              </Card>
          </div>

           {/* Minhas Vendas Ativas */}
           {mySales.length > 0 && (
              <section className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-800">Minhas Vendas Ativas</h2>
                  <MySalesList sales={mySales} />
              </section>
           )}

          <section className="space-y-4 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Oportunidades do Mercado</h2>
                <p className="text-gray-500 mt-1">
                  Encontre viajantes e faça sua oferta.
                </p>
              </div>
            </div>
            <MarketplaceList requests={openRequests} />
          </section>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  )
}
