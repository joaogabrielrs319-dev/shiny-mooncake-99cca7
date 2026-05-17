import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Filter } from 'lucide-react'
import { Button } from '@shared/components/ui/Button'
import { formatCurrency, formatRelative } from '@shared/utils/format'
import { scoreColor } from '@features/conversion-score/services/conversionScore'
import { cn } from '@shared/utils/cn'
import type { ProposalStatus } from '@shared/types'

const COLUMNS: { status: ProposalStatus; label: string; color: string }[] = [
  { status: 'draft', label: 'Novo', color: 'text-zinc-400' },
  { status: 'sent', label: 'Enviado', color: 'text-blue-400' },
  { status: 'viewed', label: 'Visualizou', color: 'text-purple-400' },
  { status: 'negotiating', label: 'Negociando', color: 'text-amber-400' },
  { status: 'hot', label: 'Hot Lead', color: 'text-[#e84d3d]' },
  { status: 'closed', label: 'Fechado', color: 'text-green-400' },
  { status: 'lost', label: 'Perdido', color: 'text-zinc-600' },
]

interface KanbanCard {
  id: string
  name: string
  vehicle: string
  plate: string
  price: number
  score: number
  status: ProposalStatus
  updatedAt: string
}

const MOCK_CARDS: KanbanCard[] = [
  { id: '1', name: 'Carlos Mendes', vehicle: 'Toyota Corolla 2022', plate: 'ABC-1D23', price: 197, score: 92, status: 'hot', updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
  { id: '2', name: 'Ana Lima', vehicle: 'Honda HRV 2021', plate: 'DEF-2E34', price: 224, score: 85, status: 'negotiating', updatedAt: new Date(Date.now() - 1000 * 60 * 20).toISOString() },
  { id: '3', name: 'Pedro Santos', vehicle: 'Hyundai Creta 2023', plate: 'GHI-3F45', price: 241, score: 78, status: 'viewed', updatedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
  { id: '4', name: 'Mariana Costa', vehicle: 'VW Polo 2022', plate: 'JKL-4G56', price: 162, score: 71, status: 'sent', updatedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString() },
  { id: '5', name: 'Roberto Alves', vehicle: 'Ford Ka 2020', plate: 'MNO-5H67', price: 128, score: 63, status: 'sent', updatedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
  { id: '6', name: 'Fernanda Rocha', vehicle: 'Chevrolet Onix 2023', plate: 'PQR-6I78', price: 148, score: 55, status: 'draft', updatedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString() },
  { id: '7', name: 'Lucas Oliveira', vehicle: 'Fiat Pulse 2022', plate: 'STU-7J89', price: 188, score: 88, status: 'closed', updatedAt: new Date(Date.now() - 1000 * 60 * 240).toISOString() },
  { id: '8', name: 'Juliana Ferreira', vehicle: 'Renault Kwid 2021', plate: 'VWX-8K90', price: 108, score: 22, status: 'lost', updatedAt: new Date(Date.now() - 1000 * 60 * 300).toISOString() },
  { id: '9', name: 'Thiago Barbosa', vehicle: 'Jeep Compass 2023', plate: 'YZA-9L01', price: 312, score: 91, status: 'hot', updatedAt: new Date(Date.now() - 1000 * 60 * 8).toISOString() },
]

function KCard({ card, onMove }: { card: KanbanCard; onMove: (id: string, status: ProposalStatus) => void }) {
  const [open, setOpen] = useState(false)
  const nextStatuses = COLUMNS.filter(c => c.status !== card.status).map(c => c)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-background border border-border rounded-xl p-3.5 cursor-pointer hover:border-border/70 hover:shadow-sm transition-all duration-150 group"
      onClick={() => setOpen(o => !o)}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-[13px] font-medium">{card.name}</p>
          <p className="text-[11px] text-muted-foreground">{card.vehicle}</p>
        </div>
        <div className="text-[11px] font-semibold tabular-nums" style={{ color: scoreColor(card.score) }}>
          {card.score}
        </div>
      </div>

      <div className="flex items-center justify-between mt-2.5">
        <span className="text-[11px] font-mono text-muted-foreground">{card.plate}</span>
        <span className="text-[12px] font-semibold text-green-500">{formatCurrency(card.price)}<span className="text-[10px] text-muted-foreground font-normal">/mês</span></span>
      </div>

      <p className="text-[10px] text-muted-foreground mt-2">{formatRelative(card.updatedAt)}</p>

      {open && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-3 pt-3 border-t border-border space-y-1" onClick={e => e.stopPropagation()}>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-2">Mover para</p>
          {nextStatuses.slice(0, 4).map(s => (
            <button
              key={s.status}
              onClick={() => { onMove(card.id, s.status); setOpen(false) }}
              className={cn('w-full text-left text-[11px] px-2.5 py-1.5 rounded-lg hover:bg-secondary transition-colors', s.color)}
            >
              {s.label}
            </button>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}

export function CrmPage() {
  const [cards, setCards] = useState<KanbanCard[]>(MOCK_CARDS)
  const [search, setSearch] = useState('')

  const moveCard = (id: string, status: ProposalStatus) => {
    setCards(prev => prev.map(c => c.id === id ? { ...c, status, updatedAt: new Date().toISOString() } : c))
  }

  const filtered = search
    ? cards.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.vehicle.toLowerCase().includes(search.toLowerCase()))
    : cards

  return (
    <div className="p-6 flex flex-col h-full">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">CRM · Pipeline</h1>
          <p className="text-sm text-muted-foreground mt-1">{cards.length} leads · Drag to move (click card to change stage)</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 h-9 px-3 rounded-lg border border-border bg-secondary/50 text-sm">
            <Search className="w-3.5 h-3.5 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar lead..."
              className="bg-transparent outline-none text-[13px] w-40 placeholder:text-muted-foreground/50"
            />
          </div>
          <Button size="sm" variant="outline"><Filter className="w-3.5 h-3.5" /></Button>
          <Button size="sm"><Plus className="w-3.5 h-3.5" />Novo Lead</Button>
        </div>
      </motion.div>

      {/* Kanban */}
      <div className="flex gap-3 overflow-x-auto pb-4 flex-1">
        {COLUMNS.map(col => {
          const colCards = filtered.filter(c => c.status === col.status)
          return (
            <div key={col.status} className="flex-shrink-0 w-[220px]">
              <div className="flex items-center justify-between mb-2.5 px-0.5">
                <span className={cn('text-[12px] font-semibold', col.color)}>{col.label}</span>
                <span className="text-[10px] bg-secondary text-muted-foreground px-1.5 py-0.5 rounded-md">
                  {colCards.length}
                </span>
              </div>
              <div className="space-y-2 min-h-[120px]">
                {colCards.map(card => (
                  <KCard key={card.id} card={card} onMove={moveCard} />
                ))}
                {colCards.length === 0 && (
                  <div className="h-20 border-2 border-dashed border-border/40 rounded-xl flex items-center justify-center">
                    <span className="text-[11px] text-muted-foreground/40">Vazio</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
