import { motion } from 'framer-motion'
import {
  TrendingUp, TrendingDown, FileText, Percent,
  DollarSign, Flame, Users, Clock,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@shared/components/ui/Card'
import { Badge } from '@shared/components/ui/Badge'
import { formatCurrency, formatDuration } from '@shared/utils/format'
import { scoreColor } from '@features/conversion-score/services/conversionScore'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const STAGGER = {
  container: { animate: { transition: { staggerChildren: 0.06 } } },
  item: { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } } },
}

const KPI_DATA = [
  { label: 'Propostas Hoje', value: '24', delta: '+18%', up: true, icon: FileText, color: 'text-green-500', bg: 'bg-green-500/10' },
  { label: 'Taxa de Conversao', value: '34.2%', delta: '+5.1%', up: true, icon: Percent, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { label: 'Ticket Medio', value: 'R$ 187', delta: '+R$12', up: true, icon: DollarSign, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { label: 'Hot Leads', value: '7', delta: '-2', up: false, icon: Flame, color: 'text-[#e84d3d]', bg: 'bg-[#e84d3d]/10' },
]

const CHART_DATA = Array.from({ length: 12 }, (_, i) => ({
  hour: `${7 + i}h`,
  propostas: Math.floor(Math.random() * 8 + 1),
  conversoes: Math.floor(Math.random() * 4),
}))

const HOT_LEADS = [
  { name: 'Carlos Mendes', plate: 'ABC-1D23', vehicle: 'Toyota Corolla 2022', score: 92, status: 'hot', time: 487, fipe: 98500 },
  { name: 'Ana Lima', plate: 'DEF-2E34', vehicle: 'Honda HRV 2021', score: 85, status: 'negotiating', time: 312, fipe: 105000 },
  { name: 'Pedro Santos', plate: 'GHI-3F45', vehicle: 'Hyundai Creta 2023', score: 78, status: 'viewed', time: 254, fipe: 115000 },
  { name: 'Mariana Costa', plate: 'JKL-4G56', vehicle: 'VW Polo 2022', score: 71, status: 'active', time: 198, fipe: 76000 },
  { name: 'Roberto Alves', plate: 'MNO-5H67', vehicle: 'Ford Ka 2020', score: 63, status: 'viewed', time: 143, fipe: 58000 },
]

const ONLINE_DATA = [
  { name: 'Carlos M.', section: 'Coberturas', time: 487, score: 92 },
  { name: 'Ana L.', section: 'Precos', time: 312, score: 85 },
  { name: 'Pedro S.', section: 'Resumo', time: 254, score: 78 },
]

function ScoreBadge({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${score}%`, background: scoreColor(score) }} />
      </div>
      <span className="text-xs font-semibold tabular-nums" style={{ color: scoreColor(score) }}>{score}</span>
    </div>
  )
}

export function DashboardPage() {
  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Visao geral · Hoje, {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
      </motion.div>

      <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5" variants={STAGGER.container} initial="initial" animate="animate">
        {KPI_DATA.map(kpi => (
          <motion.div key={kpi.label} variants={STAGGER.item}>
            <Card className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-9 h-9 rounded-lg ${kpi.bg} flex items-center justify-center`}>
                  <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md ${kpi.up ? 'bg-green-500/10 text-green-500' : 'bg-[#e84d3d]/10 text-[#e84d3d]'}`}>
                  {kpi.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {kpi.delta}
                </div>
              </div>
              <p className="text-2xl font-semibold tracking-tight">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="lg:col-span-2">
          <Card>
            <CardHeader><CardTitle>Propostas por Hora — Hoje</CardTitle></CardHeader>
            <CardContent className="pt-4">
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={CHART_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="hour" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} cursor={{ fill: 'hsl(var(--secondary))' }} />
                  <Bar dataKey="propostas" fill="#e84d3d" radius={[3, 3, 0, 0]} name="Propostas" />
                  <Bar dataKey="conversoes" fill="#3b82f6" radius={[3, 3, 0, 0]} name="Conversoes" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2"><Users className="w-3.5 h-3.5" />Online Agora</CardTitle>
                <Badge variant="live">● Live</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 pt-3">
              {ONLINE_DATA.map((c, i) => (
                <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                  <div className="w-7 h-7 rounded-full gradient-brand flex items-center justify-center text-[10px] font-semibold text-white flex-shrink-0">
                    {c.name.slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium">{c.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{c.section}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />{formatDuration(c.time)}
                    </div>
                    <div className="text-[10px] font-semibold mt-0.5" style={{ color: scoreColor(c.score) }}>{c.score}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2"><Flame className="w-3.5 h-3.5 text-[#e84d3d]" />Hot Leads</CardTitle>
              <Badge variant="hot">{HOT_LEADS.length} leads</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-3">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {['Cliente', 'Veiculo', 'Score', 'Status', 'Tempo', 'FIPE'].map(h => (
                    <th key={h} className="text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider pb-3 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {HOT_LEADS.map((lead, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-secondary/30 transition-colors cursor-pointer">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-[11px] font-medium flex-shrink-0">
                          {lead.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-[13px]">{lead.name}</p>
                          <p className="text-[11px] text-muted-foreground font-mono">{lead.plate}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-[13px] text-muted-foreground">{lead.vehicle}</td>
                    <td className="py-3 pr-4"><ScoreBadge score={lead.score} /></td>
                    <td className="py-3 pr-4">
                      <Badge variant={lead.status === 'hot' ? 'hot' : lead.status === 'negotiating' ? 'negotiating' : 'viewed'}>
                        {lead.status === 'hot' ? 'Hot Lead' : lead.status === 'negotiating' ? 'Negociando' : 'Visualizou'}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4 text-[13px] text-muted-foreground font-mono">{formatDuration(lead.time)}</td>
                    <td className="py-3 text-[13px] font-medium text-green-500">{formatCurrency(lead.fipe)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
