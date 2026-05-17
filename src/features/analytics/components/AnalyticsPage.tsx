import { motion } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, CartesianGrid, PieChart, Pie, Cell,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@shared/components/ui/Card'
import { Badge } from '@shared/components/ui/Badge'
import { TrendingUp, TrendingDown, Clock, MousePointer2, Target } from 'lucide-react'

const WEEK_DATA = [
  { day: 'Seg', propostas: 18, conversoes: 6 },
  { day: 'Ter', propostas: 22, conversoes: 9 },
  { day: 'Qua', propostas: 15, conversoes: 5 },
  { day: 'Qui', propostas: 28, conversoes: 11 },
  { day: 'Sex', propostas: 31, conversoes: 14 },
  { day: 'Sab', propostas: 20, conversoes: 8 },
  { day: 'Dom', propostas: 24, conversoes: 9 },
]
const SECTION_DATA = [
  { name: 'Coberturas', visits: 312, avg_time: 94 },
  { name: 'Precos', visits: 289, avg_time: 78 },
  { name: 'Veiculo', visits: 401, avg_time: 42 },
  { name: 'Resumo', visits: 198, avg_time: 121 },
  { name: 'Envio', visits: 87, avg_time: 35 },
]
const FUNNEL = [
  { label: 'Propostas Abertas', pct: 100 },
  { label: 'Scrollou 50%', pct: 78 },
  { label: 'Interagiu Coberturas', pct: 60 },
  { label: 'Chegou ao Preco', pct: 47 },
  { label: 'Clicou no CTA', pct: 24 },
  { label: 'Fechou', pct: 15 },
]
const HEATMAP_HOURS = Array.from({ length: 24 }, (_, i) => i)
const HEATMAP_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
const heatmapData = HEATMAP_DAYS.map(day => ({
  day,
  hours: HEATMAP_HOURS.map(h => ({ h, v: h >= 9 && h <= 20 ? Math.floor(Math.random() * 100) : Math.floor(Math.random() * 20) })),
}))
const PIE_DATA = [
  { name: 'Sul/Sudeste', value: 58, color: '#e84d3d' },
  { name: 'Nordeste', value: 22, color: '#f97316' },
  { name: 'Centro-Oeste', value: 13, color: '#f59e0b' },
  { name: 'Norte', value: 7, color: '#3b82f6' },
]
const SCORE_DISTRIBUTION = [
  { range: '0-20', count: 45, color: '#71717a' },
  { range: '21-40', count: 78, color: '#3b82f6' },
  { range: '41-60', count: 112, color: '#f59e0b' },
  { range: '61-80', count: 89, color: '#f97316' },
  { range: '81-100', count: 62, color: '#e84d3d' },
]
const KPI_DATA = [
  { label: 'Tempo Medio / Proposta', value: '4:23', delta: '+32s', up: true, icon: Clock },
  { label: 'Taxa de Abandono', value: '23%', delta: '-4%', up: true, icon: TrendingDown },
  { label: 'Profundidade de Scroll', value: '68%', delta: '+12%', up: true, icon: MousePointer2 },
  { label: 'Score Medio', value: '72', delta: '+8pts', up: true, icon: Target },
]

export function AnalyticsPage() {
  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Inteligencia de conversao e engajamento comportamental</p>
      </motion.div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {KPI_DATA.map(k => (
          <Card key={k.label} className="p-5">
            <div className={`w-8 h-8 rounded-lg ${k.up ? 'bg-green-500/10' : 'bg-[#e84d3d]/10'} flex items-center justify-center mb-3`}>
              <k.icon className={`w-4 h-4 ${k.up ? 'text-green-500' : 'text-[#e84d3d]'}`} />
            </div>
            <p className="text-2xl font-semibold tracking-tight">{k.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{k.label}</p>
            <div className={`inline-flex items-center gap-1 text-[11px] font-medium mt-2 px-1.5 py-0.5 rounded ${k.up ? 'bg-green-500/10 text-green-500' : 'bg-[#e84d3d]/10 text-[#e84d3d]'}`}>
              {k.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />} {k.delta}
            </div>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Propostas e Conversoes</CardTitle>
                <Badge variant="active">Esta semana</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={WEEK_DATA} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gProp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e84d3d" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#e84d3d" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gConv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="propostas" stroke="#e84d3d" strokeWidth={2} fill="url(#gProp)" name="Propostas" />
                  <Area type="monotone" dataKey="conversoes" stroke="#22c55e" strokeWidth={2} fill="url(#gConv)" name="Conversoes" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        <Card className="h-full">
          <CardHeader><CardTitle>Distribuicao por Regiao</CardTitle></CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={120}>
              <PieChart>
                <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={3} dataKey="value">
                  {PIE_DATA.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {PIE_DATA.map(d => (
                <div key={d.name} className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                    <span className="text-muted-foreground">{d.name}</span>
                  </div>
                  <span className="font-medium tabular-nums">{d.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <Card className="h-full">
          <CardHeader><CardTitle>Funil de Conversao</CardTitle></CardHeader>
          <CardContent className="pt-4 space-y-2">
            {FUNNEL.map((f, i) => (
              <div key={f.label}>
                <div className="flex items-center justify-between text-[12px] mb-1">
                  <span className="text-muted-foreground truncate mr-2">{f.label}</span>
                  <span className="font-semibold tabular-nums flex-shrink-0">{f.pct}%</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${f.pct}%` }} transition={{ delay: 0.4 + i * 0.07, duration: 0.5 }} className="h-full rounded-full" style={{ background: `hsl(${4 + i * 8}, 80%, ${57 - i * 4}%)` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="h-full">
          <CardHeader><CardTitle>Tempo Medio por Secao</CardTitle></CardHeader>
          <CardContent className="pt-4 space-y-3">
            {SECTION_DATA.sort((a, b) => b.avg_time - a.avg_time).map((s, i) => (
              <div key={s.name}>
                <div className="flex items-center justify-between text-[12px] mb-1">
                  <span className="text-muted-foreground">{s.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground tabular-nums">{s.visits} visitas</span>
                    <span className="font-semibold tabular-nums">{s.avg_time}s</span>
                  </div>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(s.avg_time / 121) * 100}%` }} transition={{ delay: 0.45 + i * 0.07, duration: 0.5 }} className="h-full rounded-full bg-[#e84d3d]" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="h-full">
          <CardHeader><CardTitle>Distribuicao de Score</CardTitle></CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={SCORE_DISTRIBUTION} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="range" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="count" radius={[3, 3, 0, 0]} name="Leads">
                  {SCORE_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Mapa de Calor - Engajamento por Hora e Dia</CardTitle>
            <Badge variant="default">Ultima semana</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              {heatmapData.map(row => (
                <div key={row.day} className="flex items-center gap-1 mb-1">
                  <span className="text-[10px] text-muted-foreground w-7 flex-shrink-0">{row.day}</span>
                  {row.hours.map(cell => (
                    <div key={cell.h} className="flex-1 h-5 rounded-sm cursor-pointer hover:opacity-80" style={{ background: `rgba(232, 77, 61, ${cell.v / 100})`, minWidth: 8 }} title={`${row.day} ${cell.h}h: ${cell.v}`} />
                  ))}
                </div>
              ))}
              <div className="flex items-center gap-2 mt-3">
                <span className="text-[10px] text-muted-foreground">Menor</span>
                <div className="flex gap-0.5">
                  {[0.05, 0.2, 0.4, 0.6, 0.8, 1].map(op => (
                    <div key={op} className="w-4 h-3 rounded-sm" style={{ background: `rgba(232, 77, 61, ${op})` }} />
                  ))}
                </div>
                <span className="text-[10px] text-muted-foreground">Maior</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
