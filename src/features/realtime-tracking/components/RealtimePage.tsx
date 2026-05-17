import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@shared/components/ui/Card'
import { Badge } from '@shared/components/ui/Badge'
import { formatDuration, formatCurrency } from '@shared/utils/format'
import { scoreColor } from '@features/conversion-score/services/conversionScore'
import { Activity, Users, Zap, Eye } from 'lucide-react'

interface LiveClient {
  id: string
  name: string
  section: string
  time: number
  score: number
  vehicle: string
  price: number
  lastAction: string
}

interface LiveEvent {
  id: string
  type: 'section_enter' | 'coverage_toggle' | 'cta_click' | 'plan_change' | 'page_view'
  message: string
  timestamp: number
  color: string
}

const EVENT_COLORS: Record<LiveEvent['type'], string> = {
  page_view: '#3b82f6',
  section_enter: '#a855f7',
  coverage_toggle: '#f59e0b',
  plan_change: '#f97316',
  cta_click: '#e84d3d',
}

const SECTIONS = ['Veiculo', 'Coberturas', 'Precos', 'Resumo', 'Enviando']

const INITIAL_CLIENTS: LiveClient[] = [
  { id: '1', name: 'Carlos Mendes', section: 'Coberturas', time: 487, score: 92, vehicle: 'Toyota Corolla 2022', price: 197, lastAction: 'Adicionou Carro Reserva' },
  { id: '2', name: 'Ana Lima', section: 'Precos', time: 312, score: 85, vehicle: 'Honda HRV 2021', price: 224, lastAction: 'Alterou franquia para R$2.000' },
  { id: '3', name: 'Pedro Santos', section: 'Resumo', time: 254, score: 78, vehicle: 'Hyundai Creta 2023', price: 241, lastAction: 'Chegou ao resumo' },
  { id: '4', name: 'Thiago Barbosa', section: 'Veiculo', time: 48, score: 45, vehicle: 'Jeep Compass 2023', price: 312, lastAction: 'Abriu proposta' },
]

function generateEvent(clients: LiveClient[]): LiveEvent {
  const client = clients[Math.floor(Math.random() * clients.length)]
  const types: LiveEvent['type'][] = ['section_enter', 'coverage_toggle', 'cta_click', 'plan_change']
  const type = types[Math.floor(Math.random() * types.length)]
  const sectionNames = ['Coberturas', 'Precos', 'Resumo', 'Veiculo']
  const messages: Record<LiveEvent['type'], string> = {
    section_enter: `${client.name} → ${sectionNames[Math.floor(Math.random() * sectionNames.length)]}`,
    coverage_toggle: `${client.name} alterou cobertura`,
    cta_click: `${client.name} clicou em Enviar`,
    plan_change: `${client.name} mudou para plano Premium`,
    page_view: `${client.name} abriu proposta`,
  }
  return {
    id: crypto.randomUUID(),
    type,
    message: messages[type],
    timestamp: Date.now(),
    color: EVENT_COLORS[type],
  }
}

export function RealtimePage() {
  const [clients, setClients] = useState<LiveClient[]>(INITIAL_CLIENTS)
  const [events, setEvents] = useState<LiveEvent[]>([])
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setClients(prev => prev.map(c => ({
        ...c,
        time: c.time + 2,
        score: Math.min(100, c.score + (Math.random() > 0.8 ? 1 : 0)),
        section: Math.random() > 0.9 ? SECTIONS[Math.floor(Math.random() * SECTIONS.length)] : c.section,
      })))
      if (Math.random() > 0.4) {
        const newEvent = generateEvent(INITIAL_CLIENTS)
        setEvents(prev => [newEvent, ...prev].slice(0, 30))
      }
    }, 2500)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  const avgScore = Math.round(clients.reduce((s, c) => s + c.score, 0) / clients.length)

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Monitoramento Realtime</h1>
          <p className="text-sm text-muted-foreground mt-1">Clientes ativos agora · Feed de eventos ao vivo</p>
        </div>
        <Badge variant="live">● {clients.length} online agora</Badge>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Online Agora', value: String(clients.length), icon: Users, color: 'text-green-500', bg: 'bg-green-500/10' },
          { label: 'Eventos / min', value: String(Math.floor(Math.random() * 8 + 3)), icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Score Medio', value: String(avgScore), icon: Activity, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Visualizacoes Hoje', value: '401', icon: Eye, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        ].map(k => (
          <Card key={k.label} className="p-4">
            <div className={`w-8 h-8 ${k.bg} rounded-lg flex items-center justify-center mb-3`}>
              <k.icon className={`w-4 h-4 ${k.color}`} />
            </div>
            <p className="text-2xl font-semibold tracking-tight">{k.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{k.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2"><Users className="w-3.5 h-3.5" />Clientes Visualizando Agora</CardTitle>
              <Badge variant="live">● Live</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5 pt-3">
            <AnimatePresence mode="popLayout">
              {clients.map(c => (
                <motion.div key={c.id} layout initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40 border border-border hover:border-border/70 transition-all">
                  <div className="w-9 h-9 rounded-full gradient-brand flex items-center justify-center text-[11px] font-semibold text-white flex-shrink-0">
                    {c.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-[13px] font-medium truncate">{c.name}</p>
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0 animate-pulse-dot" />
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">{c.vehicle} · {formatCurrency(c.price)}/mes</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{c.lastAction}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="text-[11px] bg-secondary px-2 py-0.5 rounded-md text-muted-foreground mb-1">{c.section}</div>
                    <div className="text-[11px] font-semibold tabular-nums" style={{ color: scoreColor(c.score) }}>Score {c.score}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">{formatDuration(c.time)}</div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2"><Zap className="w-3.5 h-3.5" />Feed de Eventos</CardTitle>
              <Badge variant="live">● Live</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-3">
            <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
              <AnimatePresence mode="popLayout" initial={false}>
                {events.length === 0 && (
                  <div className="text-center text-sm text-muted-foreground py-8">Aguardando eventos...</div>
                )}
                {events.map(ev => (
                  <motion.div key={ev.id} layout initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-secondary/30 border border-border/50 text-[12px]">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: ev.color }} />
                    <span className="flex-1 text-muted-foreground truncate">{ev.message}</span>
                    <span className="text-[10px] text-muted-foreground font-mono flex-shrink-0">
                      {new Date(ev.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-4">
        <Card>
          <CardHeader><CardTitle>Jornada dos Clientes Ativos</CardTitle></CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {clients.map(c => {
                const sectionIndex = SECTIONS.indexOf(c.section)
                return (
                  <div key={c.id} className="flex items-center gap-4">
                    <p className="text-[12px] font-medium w-28 flex-shrink-0 truncate">{c.name.split(' ')[0]}</p>
                    <div className="flex-1 flex items-center gap-1">
                      {SECTIONS.map((s, i) => (
                        <div key={s} className="flex-1 flex flex-col items-center gap-1">
                          <div className={`w-full h-2 rounded-full transition-all duration-500 ${i <= sectionIndex ? 'bg-[#e84d3d]' : 'bg-secondary'}`} />
                          <p className="text-[9px] text-muted-foreground text-center hidden sm:block">{s}</p>
                        </div>
                      ))}
                    </div>
                    <div className="text-[11px] font-semibold w-12 text-right flex-shrink-0" style={{ color: scoreColor(c.score) }}>
                      {c.score}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
