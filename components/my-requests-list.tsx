'use client'

import { useState, useTransition } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { acceptOffer, confirmReceipt, cancelFlightRequest } from '@/app/actions/flight'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import { 
    Download, 
    Plane, 
    Calendar, 
    Copy, 
    Search, 
    CheckCircle2, 
    AlertCircle, 
    Clock, 
    FileText, 
    XCircle,
    AlertTriangle,
    Loader2,
    MoreHorizontal,
    ArrowRight
} from 'lucide-react'
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogFooter } from '@/components/ui/dialog'
import { PassengerForm } from '@/components/passenger-form'
import { PendingPaymentAlert } from '@/components/pending-payment-alert'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Input } from './ui/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ViewOffersDialog } from '@/components/view-offers-dialog'

type RequestStatus = 'ALL' | 'OPEN' | 'OFFER_ACCEPTED' | 'PAID' | 'ISSUED' | 'COMPLETED' | 'CANCELED'

function AcceptOfferButton({ offerId }: { offerId: string }) {
  const router = useRouter()
  
  async function handleClick() {
    const res = await acceptOffer(offerId)
    if (res.checkoutUrl) {
      router.push(res.checkoutUrl)
    }
  }

  return (
    <Button 
      size="sm" 
      onClick={handleClick}
      className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 w-full justify-center"
    >
      Aceitar e Pagar
    </Button>
  )
}

function ConfirmReceiptButton({ offerId }: { offerId: string }) {
  return (
    <form action={async () => { await confirmReceipt(offerId) }}>
      <Button size="sm" variant="default" className="bg-blue-600 hover:bg-blue-700 text-white font-medium w-full">
        Confirmar Recebimento
      </Button>
    </form>
  )
}

function CancelRequestButton({ requestId }: { requestId: string }) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  async function handleCancel() {
    startTransition(async () => {
        try {
            const result = await cancelFlightRequest(requestId)
            if (result.success) {
                setOpen(false)
            } else {
                alert(result.error || 'Erro ao cancelar solicitação.')
            }
        } catch (error) {
            console.error(error)
            alert('Erro de conexão. Tente novamente.')
        }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-500 hover:text-red-700 hover:bg-red-50 w-full justify-start"
            >
                <XCircle className="w-3.5 h-3.5 mr-2" />
                Cancelar Pedido
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                    Cancelar Solicitação
                </DialogTitle>
                <DialogDescription className="pt-2">
                    Tem certeza que deseja cancelar esta solicitação de viagem?
                </DialogDescription>
            </DialogHeader>
            
            <div className="bg-red-50 p-4 rounded-lg border border-red-100 text-sm text-red-800 space-y-2">
                <p className="font-medium">Ao cancelar:</p>
                <ul className="list-disc list-inside space-y-1 opacity-90">
                    <li>Sua solicitação será removida do mural de oportunidades.</li>
                    <li>As ofertas recebidas serão descartadas.</li>
                    <li>Essa ação <strong>não pode ser desfeita</strong>.</li>
                </ul>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
                <DialogClose asChild>
                    <Button type="button" variant="secondary" disabled={isPending}>
                        Voltar
                    </Button>
                </DialogClose>
                <Button 
                    type="button" 
                    variant="destructive" 
                    onClick={handleCancel}
                    disabled={isPending}
                    className="gap-2"
                >
                    {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                    Confirmar Cancelamento
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

function RequestActions({ req }: { req: any }) {
  const router = useRouter()
  const acceptedOffer = req.offers?.find((o: any) => o.status === 'ACCEPTED')
  const issuedOffer = req.offers?.find((o: any) => o.status === 'TICKET_ISSUED')

  if (req.status === 'OPEN') {
      return (
          <>
              {req.offers?.length > 0 && (
                  <ViewOffersDialog request={req} />
              )}
              <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                      </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuItem onSelect={(e: any) => e.preventDefault()}>
                          <CancelRequestButton requestId={req.id} />
                      </DropdownMenuItem>
                  </DropdownMenuContent>
              </DropdownMenu>
          </>
      )
  }

  if (req.status === 'OFFER_ACCEPTED' && acceptedOffer) {
      return (
          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white h-8 text-xs w-full md:w-auto" onClick={() => router.push(`/checkout/${acceptedOffer.id}`)}>
              Pagar Agora
          </Button>
      )
  }

  if (req.status === 'PAID') {
      return (
          <Dialog>
              <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="h-8 text-xs border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 w-full md:w-auto">
                      {(!req.passengers || req.passengers.length === 0) ? 'Preencher Dados' : 'Ver Dados'}
                  </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                      <DialogTitle>Dados dos Passageiros</DialogTitle>
                      <DialogDescription>
                          Preencha as informações necessárias para a emissão das passagens.
                      </DialogDescription>
                  </DialogHeader>
                  <PassengerForm flightRequestId={req.id} onSuccess={() => window.location.reload()} />
              </DialogContent>
          </Dialog>
      )
  }

  if (req.status === 'ISSUED' && issuedOffer) {
      return (
          <Dialog>
              <DialogTrigger asChild>
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 text-xs w-full md:w-auto">
                      Ver Bilhete
                  </Button>
              </DialogTrigger>
              <DialogContent>
                  <DialogHeader>
                      <DialogTitle>Passagem Emitida!</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                      <div className="bg-gray-50 p-4 rounded-lg border">
                          <p className="text-sm font-medium text-gray-500">Localizador (PNR)</p>
                          <div className="flex items-center gap-2 mt-1">
                              <code className="text-xl font-bold">{issuedOffer.pnr}</code>
                              <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => navigator.clipboard.writeText(issuedOffer.pnr)}>
                                  <Copy className="h-3 w-3" />
                              </Button>
                          </div>
                      </div>
                      
                      {issuedOffer.proofUrl && (
                          <Button asChild variant="outline" className="w-full">
                              <a href={issuedOffer.proofUrl} target="_blank" rel="noopener noreferrer">
                                  <Download className="mr-2 h-4 w-4" /> Baixar Comprovante
                              </a>
                          </Button>
                      )}

                      <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
                          <p className="font-bold mb-1">Confirme no site da cia aérea</p>
                          <p>Antes de liberar o pagamento, verifique se a reserva está correta no site da companhia.</p>
                      </div>
                      
                      <ConfirmReceiptButton offerId={issuedOffer.id} />
                  </div>
              </DialogContent>
          </Dialog>
      )
  }

  return <span className="text-gray-400 hidden md:inline">-</span>
}

export function MyRequestsList({ requests }: { requests: any[] }) {
  const router = useRouter()
  const [filter, setFilter] = useState<RequestStatus>('ALL')
  const [searchTerm, setSearchTerm] = useState('')

  // Check for pending payments (ACCEPTED but not PAID) for alert
  let pendingAlert = null
  for (const req of requests) {
    if (req.status === 'CANCELED') continue;
    const acceptedOffer = req.offers?.find((o: any) => o.status === 'ACCEPTED')
    if (acceptedOffer) {
      pendingAlert = (
        <PendingPaymentAlert 
            key={acceptedOffer.id}
            offerId={acceptedOffer.id}
            updatedAt={acceptedOffer.updatedAt}
            origin={req.origin}
            destination={req.destination}
            price={acceptedOffer.totalPrice}
        />
      )
      break
    }
  }

  const statusMap = {
    OPEN: { label: 'Aguardando Ofertas', color: 'bg-blue-50 text-blue-700 border-blue-100', icon: Clock },
    OFFER_ACCEPTED: { label: 'Pagamento Pendente', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: AlertCircle },
    PAID: { label: 'Aguardando Emissão', color: 'bg-orange-50 text-orange-700 border-orange-100', icon: Clock },
    ISSUED: { label: 'Emitido (Confirmar)', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: FileText },
    COMPLETED: { label: 'Concluído', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: CheckCircle2 },
    CANCELED: { label: 'Cancelado', color: 'bg-red-50 text-red-700 border-red-100', icon: XCircle },
  }

  const filteredRequests = requests.filter(req => {
    // Status Filter
    if (filter !== 'ALL') {
        if (req.status !== filter) return false
    }
    
    // Search Filter
    if (searchTerm) {
        const search = searchTerm.toLowerCase()
        return (
            req.origin.toLowerCase().includes(search) ||
            req.destination.toLowerCase().includes(search) ||
            req.id.toLowerCase().includes(search)
        )
    }
    return true
  })

  // Group counts for tabs
  const counts = {
    ALL: requests.length,
    OPEN: requests.filter(r => r.status === 'OPEN').length,
    OFFER_ACCEPTED: requests.filter(r => r.status === 'OFFER_ACCEPTED').length,
    PAID: requests.filter(r => r.status === 'PAID').length,
    ISSUED: requests.filter(r => r.status === 'ISSUED').length,
    COMPLETED: requests.filter(r => r.status === 'COMPLETED').length,
    CANCELED: requests.filter(r => r.status === 'CANCELED').length
  }

  return (
    <div className="space-y-6">
      {pendingAlert}

      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            <FilterButton active={filter === 'ALL'} onClick={() => setFilter('ALL')} label="Todas" count={counts.ALL} />
            <FilterButton active={filter === 'OPEN'} onClick={() => setFilter('OPEN')} label="Abertas" count={counts.OPEN} />
            <FilterButton active={filter === 'OFFER_ACCEPTED'} onClick={() => setFilter('OFFER_ACCEPTED')} label="Pagar" count={counts.OFFER_ACCEPTED} urgent={counts.OFFER_ACCEPTED > 0} />
            <FilterButton active={filter === 'PAID'} onClick={() => setFilter('PAID')} label="Emissão" count={counts.PAID} />
            <FilterButton active={filter === 'ISSUED'} onClick={() => setFilter('ISSUED')} label="Confirmar" count={counts.ISSUED} urgent={counts.ISSUED > 0} />
            <FilterButton active={filter === 'COMPLETED'} onClick={() => setFilter('COMPLETED')} label="Concluídas" count={counts.COMPLETED} />
            <FilterButton active={filter === 'CANCELED'} onClick={() => setFilter('CANCELED')} label="Canceladas" count={counts.CANCELED} />
        </div>

        <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
                placeholder="Buscar pedido, origem..." 
                className="pl-9 h-9 bg-gray-50 border-gray-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      {/* Desktop Table List */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <Table>
            <TableHeader className="bg-gray-50/50">
                <TableRow>
                    <TableHead className="w-[100px]">Pedido</TableHead>
                    <TableHead>Rota</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ofertas</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ação</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredRequests.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={6} className="h-32 text-center text-gray-500">
                            Nenhuma solicitação encontrada com este filtro.
                        </TableCell>
                    </TableRow>
                ) : (
                    filteredRequests.map((req) => {
                        const status = statusMap[req.status as keyof typeof statusMap] || statusMap.OPEN
                        const StatusIcon = status.icon
                        
                        return (
                            <TableRow key={req.id} className="group hover:bg-gray-50/50 transition-colors">
                                <TableCell className="font-mono text-xs font-medium text-gray-500">
                                    #{req.id.slice(0, 6)}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 font-medium text-gray-900">
                                        <Plane className="w-4 h-4 text-blue-600" />
                                        {req.origin} 
                                        <span className="text-gray-400">→</span> 
                                        {req.destination}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        {format(new Date(req.departDate), "dd MMM", { locale: ptBR })}
                                        {req.returnDate && ` - ${format(new Date(req.returnDate), "dd MMM", { locale: ptBR })}`}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="font-normal text-xs">
                                        {req.offers?.length || 0} ofertas
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${status.color}`}>
                                        <StatusIcon className="w-3.5 h-3.5" />
                                        {status.label}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end items-center gap-2">
                                        <RequestActions req={req} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        )
                    })
                )}
            </TableBody>
        </Table>
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden space-y-4">
        {filteredRequests.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                <p className="text-gray-500">Nenhuma solicitação encontrada.</p>
            </div>
        ) : (
            filteredRequests.map((req) => {
                const status = statusMap[req.status as keyof typeof statusMap] || statusMap.OPEN
                const StatusIcon = status.icon

                return (
                    <div key={req.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="font-mono text-xs font-medium text-gray-500">#{req.id.slice(0, 6)}</span>
                                <div className="font-medium text-gray-900 flex items-center gap-2 mt-1">
                                    {req.origin} <ArrowRight className="w-3 h-3 text-gray-400" /> {req.destination}
                                </div>
                            </div>
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${status.color}`}>
                                <StatusIcon className="w-3.5 h-3.5" />
                                {status.label}
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                {format(new Date(req.departDate), "dd MMM", { locale: ptBR })}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Badge variant="secondary" className="font-normal text-xs">
                                    {req.offers?.length || 0} ofertas
                                </Badge>
                            </div>
                        </div>

                        <div className="pt-3 border-t border-gray-50 flex justify-end gap-2">
                            <RequestActions req={req} />
                        </div>
                    </div>
                )
            })
        )}
      </div>
    </div>
  )
}

function FilterButton({ active, onClick, label, count, urgent }: { active: boolean, onClick: () => void, label: string, count: number, urgent?: boolean }) {
    return (
        <button 
            onClick={onClick}
            className={`
                flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                ${active 
                    ? 'bg-gray-900 text-white shadow-sm' 
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200'
                }
            `}
        >
            {label}
            <span className={`
                text-[10px] px-1.5 py-0.5 rounded-full
                ${active ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-600'}
                ${urgent && !active ? 'bg-red-100 text-red-700 font-bold animate-pulse' : ''}
            `}>
                {count}
            </span>
        </button>
    )
}
