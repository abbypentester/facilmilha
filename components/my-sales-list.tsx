'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Plane, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  FileText,
  Filter,
  Search,
  XCircle
} from 'lucide-react'
import { IssueTicketDialog } from './issue-ticket-dialog'
import { Input } from './ui/input'

type SaleStatus = 'ALL' | 'ACCEPTED' | 'PAID_BY_BUYER' | 'TICKET_ISSUED' | 'COMPLETED' | 'CANCELED'

export function MySalesList({ sales }: { sales: any[] }) {
  const [filter, setFilter] = useState<SaleStatus>('ALL')
  const [searchTerm, setSearchTerm] = useState('')

  const statusMap = {
    ACCEPTED: { label: 'Aguardando Pagamento', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
    PAID_BY_BUYER: { label: 'Emitir Passagem', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: AlertCircle },
    TICKET_ISSUED: { label: 'Emitido', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: FileText },
    COMPLETED: { label: 'Concluído', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: CheckCircle2 },
    CANCELED: { label: 'Cancelado', color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle },
    PENDING: { label: 'Pendente', color: 'bg-gray-100 text-gray-800 border-gray-200', icon: Clock },
    REJECTED: { label: 'Rejeitado', color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle },
  }

  const filteredSales = sales.filter(sale => {
    // Status Filter
    if (filter !== 'ALL') {
        if (filter === 'CANCELED' && (sale.status === 'REJECTED' || sale.flightRequest.status === 'CANCELED')) return true
        if (sale.status !== filter) return false
    }
    
    // Search Filter
    if (searchTerm) {
        const search = searchTerm.toLowerCase()
        return (
            sale.flightRequest.origin.toLowerCase().includes(search) ||
            sale.flightRequest.destination.toLowerCase().includes(search) ||
            sale.flightRequest.id.toLowerCase().includes(search) ||
            (sale.pnr && sale.pnr.toLowerCase().includes(search))
        )
    }
    return true
  })

  // Group counts for tabs
  const counts = {
    ALL: sales.length,
    ACCEPTED: sales.filter(s => s.status === 'ACCEPTED').length,
    PAID_BY_BUYER: sales.filter(s => s.status === 'PAID_BY_BUYER').length,
    TICKET_ISSUED: sales.filter(s => s.status === 'TICKET_ISSUED').length,
    COMPLETED: sales.filter(s => s.status === 'COMPLETED').length,
    CANCELED: sales.filter(s => s.status === 'CANCELED' || s.status === 'REJECTED').length
  }

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            <FilterButton active={filter === 'ALL'} onClick={() => setFilter('ALL')} label="Todas" count={counts.ALL} />
            <FilterButton active={filter === 'ACCEPTED'} onClick={() => setFilter('ACCEPTED')} label="Aceitas" count={counts.ACCEPTED} />
            <FilterButton active={filter === 'PAID_BY_BUYER'} onClick={() => setFilter('PAID_BY_BUYER')} label="Para Emitir" count={counts.PAID_BY_BUYER} urgent={counts.PAID_BY_BUYER > 0} />
            <FilterButton active={filter === 'TICKET_ISSUED'} onClick={() => setFilter('TICKET_ISSUED')} label="Emitidas" count={counts.TICKET_ISSUED} />
            <FilterButton active={filter === 'COMPLETED'} onClick={() => setFilter('COMPLETED')} label="Finalizadas" count={counts.COMPLETED} />
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

      {/* Table List */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <Table>
            <TableHeader className="bg-gray-50/50">
                <TableRow>
                    <TableHead className="w-[100px]">Pedido</TableHead>
                    <TableHead>Rota</TableHead>
                    <TableHead>Data Viagem</TableHead>
                    <TableHead>Valor Líquido</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ação</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredSales.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={6} className="h-32 text-center text-gray-500">
                            Nenhuma venda encontrada com este filtro.
                        </TableCell>
                    </TableRow>
                ) : (
                    filteredSales.map((sale) => {
                        const status = statusMap[sale.status as keyof typeof statusMap] || statusMap.PENDING
                        const StatusIcon = status.icon

                        return (
                            <TableRow key={sale.id} className="group hover:bg-gray-50/50 transition-colors">
                                <TableCell className="font-mono text-xs font-medium text-gray-500">
                                    #{sale.flightRequest.id.slice(0, 6)}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 font-medium text-gray-900">
                                        <Plane className="w-4 h-4 text-emerald-600" />
                                        {sale.flightRequest.origin} 
                                        <span className="text-gray-400">→</span> 
                                        {sale.flightRequest.destination}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        {format(new Date(sale.flightRequest.departDate), "dd MMM, yyyy", { locale: ptBR })}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded text-sm">
                                        R$ {sale.netAmount.toFixed(2)}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${status.color}`}>
                                        <StatusIcon className="w-3.5 h-3.5" />
                                        {status.label}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    {sale.status === 'PAID_BY_BUYER' && (
                                        <IssueTicketDialog sale={sale} />
                                    )}
                                    {sale.status === 'TICKET_ISSUED' && (
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="text-xs text-gray-500 font-mono">PNR: {sale.pnr}</span>
                                            <span className="text-[10px] text-orange-600 font-medium">Aguardando Cliente</span>
                                        </div>
                                    )}
                                    {sale.status === 'COMPLETED' && (
                                        <span className="text-xs text-emerald-600 font-bold flex items-center justify-end gap-1">
                                            <CheckCircle2 className="w-3 h-3" /> Pago
                                        </span>
                                    )}
                                </TableCell>
                            </TableRow>
                        )
                    })
                )}
            </TableBody>
        </Table>
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
