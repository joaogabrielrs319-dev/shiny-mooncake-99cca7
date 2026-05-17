import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, CheckCircle2, Car, Shield, Sliders, Send } from 'lucide-react'
import { useProposalStore } from '../store/proposalStore'
import { fetchVehicleByPlate } from '@features/vehicle-search/services/vehicleApi'
import { fetchFipeValue } from '@features/fipe/services/fipeApi'
import { formatCurrency, formatPlate } from '@shared/utils/format'
import { Button } from '@shared/components/ui/Button'
import { Card } from '@shared/components/ui/Card'
import { cn } from '@shared/utils/cn'
import { toast } from 'sonner'
import type { RegionType } from '@shared/types'

const COVERAGES = [
  { id: 'colisao', name: 'Colisao / Perda Total', icon: '🚗', price: 0 },
  { id: 'roubo', name: 'Roubo / Furto', icon: '🔐', price: 0 },
  { id: 'incendio', name: 'Incendio', icon: '🔥', price: 0 },
  { id: 'vidros', name: 'Vidros e Farois', icon: '🪟', price: 15 },
  { id: 'terceiros', name: 'Responsabilidade Civil', icon: '🤝', price: 22 },
  { id: 'carro-reserva', name: 'Carro Reserva', icon: '🔄', price: 18 },
  { id: 'assistencia-24h', name: 'Assistencia 24h', icon: '📞', price: 12 },
  { id: 'rastreador', name: 'Rastreador', icon: '📡', price: 25 },
]

const REGIONS: { value: RegionType; label: string }[] = [
  { value: 'sul-sudeste', label: 'Sul/Sudeste' },
  { value: 'centro-oeste', label: 'Centro-Oeste' },
  { value: 'nordeste', label: 'Nordeste' },
  { value: 'norte', label: 'Norte' },
]

const plateSchema = z.object({
  plate: z.string().min(7, 'Placa deve ter 7 caracteres').max(8),
})

type PlateForm = z.infer<typeof plateSchema>

function StepIndicator({ step, current }: { step: number; current: number }) {
  const done = current > step
  const active = current === step
  return (
    <div className={cn('w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold flex-shrink-0 transition-all duration-300', done ? 'bg-green-500 text-white' : active ? 'bg-[#e84d3d] text-white' : 'bg-secondary text-muted-foreground')}>
      {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : step}
    </div>
  )
}

export function ProposalPage() {
  const store = useProposalStore()
  const [loadingPlate, setLoadingPlate] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<PlateForm>({
    resolver: zodResolver(plateSchema),
  })

  const fetchVehicle = useCallback(async (plate: string) => {
    setLoadingPlate(true)
    try {
      const v = await fetchVehicleByPlate(plate)
      const fipe = await fetchFipeValue(v.brand, v.model, v.year)
      store.setVehicle({ ...v, fipe_code: fipe.fipe_code, fipe_value: fipe.fipe_value })
      store.setStep(2)
      toast.success(`Veiculo encontrado: ${v.brand} ${v.model}`)
    } catch {
      toast.error('Placa nao encontrada. Verifique e tente novamente.')
    } finally {
      setLoadingPlate(false)
    }
  }, [store])

  const onPlateSubmit = (data: PlateForm) => fetchVehicle(data.plate)

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight">Nova Proposta</h1>
        <p className="text-sm text-muted-foreground mt-1">Configurador interativo · Precificacao em tempo real</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5 items-start">
        <div className="space-y-3">
          {/* STEP 1 */}
          <Card className={cn('overflow-hidden transition-all duration-300', store.step === 1 ? 'border-[#e84d3d]/30' : '')}>
            <button className="w-full flex items-center gap-3 p-5 text-left hover:bg-secondary/30 transition-colors" onClick={() => store.step > 1 && store.setStep(1)}>
              <StepIndicator step={1} current={store.step} />
              <Car className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Identificacao do Veiculo</p>
                <p className="text-xs text-muted-foreground">Busca automatica por placa + FIPE</p>
              </div>
              {store.vehicle && <p className="ml-auto text-xs font-medium text-green-500">{store.vehicle.brand} {store.vehicle.model}</p>}
            </button>
            <AnimatePresence>
              {store.step === 1 && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                  <div className="px-5 pb-5">
                    <div className={cn('flex items-center gap-2 border rounded-xl px-4 h-12 transition-all duration-150', errors.plate ? 'border-destructive' : 'border-border focus-within:border-[#e84d3d]/60 focus-within:ring-2 focus-within:ring-[#e84d3d]/10')}>
                      <span className="text-lg">🇧🇷</span>
                      <input
                        {...register('plate')}
                        placeholder="ABC1D23"
                        maxLength={8}
                        className="flex-1 bg-transparent font-mono text-base font-medium tracking-widest uppercase outline-none placeholder:text-muted-foreground/40 placeholder:font-sans placeholder:normal-case placeholder:tracking-normal placeholder:text-sm"
                        onChange={e => { e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') }}
                      />
                      {loadingPlate && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                    </div>
                    {errors.plate && <p className="text-[11px] text-destructive mt-1">{String(errors.plate.message)}</p>}
                    <Button className="w-full mt-3" onClick={handleSubmit(onPlateSubmit)} disabled={loadingPlate}>
                      {loadingPlate ? <><Loader2 className="w-4 h-4 animate-spin" />Buscando...</> : 'Buscar Veiculo'}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* STEP 2 */}
          <Card className={cn('overflow-hidden transition-all duration-300', store.step === 2 ? 'border-[#e84d3d]/30' : '')}>
            <button className="w-full flex items-center gap-3 p-5 text-left hover:bg-secondary/30 transition-colors" onClick={() => store.step > 2 && store.setStep(2)}>
              <StepIndicator step={2} current={store.step} />
              <Shield className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Coberturas</p>
                <p className="text-xs text-muted-foreground">Selecione as protecoes desejadas</p>
              </div>
              {store.selectedCoverages.length > 0 && store.step > 2 && (
                <span className="ml-auto text-xs text-muted-foreground">{store.selectedCoverages.length} ativas</span>
              )}
            </button>
            <AnimatePresence>
              {store.step === 2 && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                  <div className="px-5 pb-5">
                    <div className="grid grid-cols-2 gap-2">
                      {COVERAGES.map(cov => {
                        const selected = store.selectedCoverages.includes(cov.id)
                        return (
                          <motion.button key={cov.id} whileTap={{ scale: 0.97 }} onClick={() => store.toggleCoverage(cov.id)} className={cn('text-left p-3 rounded-xl border transition-all duration-150', selected ? 'border-[#e84d3d]/40 bg-[#e84d3d]/5' : 'border-border hover:border-border/80 hover:bg-secondary/40')}>
                            <div className="text-lg mb-1.5">{cov.icon}</div>
                            <p className={cn('text-[12px] font-medium', selected ? 'text-foreground' : 'text-muted-foreground')}>{cov.name}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{cov.price > 0 ? `+${formatCurrency(cov.price)}/mes` : 'Incluido'}</p>
                          </motion.button>
                        )
                      })}
                    </div>
                    <Button className="w-full mt-3" onClick={() => store.setStep(3)}>Continuar →</Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* STEP 3 */}
          <Card className={cn('overflow-hidden transition-all duration-300', store.step === 3 ? 'border-[#e84d3d]/30' : '')}>
            <button className="w-full flex items-center gap-3 p-5 text-left hover:bg-secondary/30 transition-colors" onClick={() => store.step > 3 && store.setStep(3)}>
              <StepIndicator step={3} current={store.step} />
              <Sliders className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Simulacao de Preco</p>
                <p className="text-xs text-muted-foreground">Franquia, regiao e plano</p>
              </div>
            </button>
            <AnimatePresence>
              {store.step === 3 && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                  <div className="px-5 pb-5 space-y-5">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Plano</p>
                      <div className="grid grid-cols-3 gap-2">
                        {(['basic', 'standard', 'premium'] as const).map(p => (
                          <button key={p} onClick={() => store.setPlan(p)} className={cn('py-2 px-3 rounded-lg border text-xs font-medium capitalize transition-all', store.plan === p ? 'border-[#e84d3d]/50 bg-[#e84d3d]/10 text-[#e84d3d]' : 'border-border text-muted-foreground hover:border-border/80')}>
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Franquia</p>
                        <p className="text-xs font-semibold text-[#e84d3d]">{formatCurrency(store.franchise)}</p>
                      </div>
                      <input type="range" min={1000} max={5000} step={500} value={store.franchise} onChange={e => store.setFranchise(Number(e.target.value))} className="w-full accent-[#e84d3d]" />
                      <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                        <span>R$ 1.000</span><span>R$ 5.000</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Regiao</p>
                      <div className="grid grid-cols-2 gap-2">
                        {REGIONS.map(r => (
                          <button key={r.value} onClick={() => store.setRegion(r.value)} className={cn('py-2 px-3 rounded-lg border text-xs font-medium transition-all', store.region === r.value ? 'border-[#e84d3d]/50 bg-[#e84d3d]/10 text-[#e84d3d]' : 'border-border text-muted-foreground hover:border-border/80')}>
                            {r.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <Button className="w-full" onClick={() => store.setStep(4)}>Revisar e Enviar →</Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* STEP 4 */}
          <Card className={cn('overflow-hidden transition-all duration-300', store.step === 4 ? 'border-[#e84d3d]/30' : '')}>
            <button className="w-full flex items-center gap-3 p-5 text-left">
              <StepIndicator step={4} current={store.step} />
              <Send className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Envio</p>
                <p className="text-xs text-muted-foreground">WhatsApp, E-mail ou Link unico</p>
              </div>
            </button>
            <AnimatePresence>
              {store.step === 4 && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                  <div className="px-5 pb-5 space-y-2">
                    <Button className="w-full" onClick={() => toast.success('Proposta enviada via WhatsApp!')}>📱 Enviar pelo WhatsApp</Button>
                    <Button variant="outline" className="w-full" onClick={() => toast.success('Link copiado!')}>🔗 Copiar Link Unico</Button>
                    <Button variant="outline" className="w-full" onClick={() => toast.success('PDF gerado!')}>📄 Baixar PDF</Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>

        {/* Preview */}
        <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="sticky top-6">
          <div className="rounded-2xl border border-border overflow-hidden bg-card">
            <div className="p-5 bg-gradient-to-br from-[#e84d3d]/15 to-[#f97316]/10 border-b border-border">
              <p className="text-[11px] font-bold text-[#e84d3d] uppercase tracking-widest mb-3">Universo AGV</p>
              <p className="text-base font-semibold">
                {store.vehicle ? `${store.vehicle.brand} ${store.vehicle.model}` : 'Aguardando veiculo...'}
              </p>
              <p className="text-xs text-muted-foreground font-mono mt-1">
                {store.vehicle ? `Placa: ${formatPlate(store.vehicle.plate)}` : '—'}
              </p>
              {store.vehicle && (
                <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-muted-foreground">Tabela FIPE</p>
                    <p className="text-sm font-semibold text-green-500">{formatCurrency(store.vehicle.fipe_value)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-muted-foreground">Ano</p>
                    <p className="text-sm font-semibold">{store.vehicle.year}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="p-5">
              <p className="text-[10px] font-bold text-[#e84d3d] uppercase tracking-widest mb-3">Plano {store.plan}</p>
              <div className="space-y-2">
                {COVERAGES.filter(c => store.selectedCoverages.includes(c.id)).map(c => (
                  <div key={c.id} className="flex items-center justify-between text-[12px]">
                    <span className="text-muted-foreground">{c.icon} {c.name}</span>
                    <span className="text-green-500 font-medium">✓</span>
                  </div>
                ))}
                {COVERAGES.filter(c => !store.selectedCoverages.includes(c.id)).map(c => (
                  <div key={c.id} className="flex items-center justify-between text-[12px] opacity-40">
                    <span className="text-muted-foreground">{c.name}</span>
                    <span>—</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border mt-4 pt-4">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Total / mes</p>
                    <motion.p key={store.monthlyPrice} initial={{ scale: 1.05 }} animate={{ scale: 1 }} className="text-2xl font-bold tracking-tight">
                      {store.monthlyPrice > 0 ? formatCurrency(store.monthlyPrice) : '—'}
                    </motion.p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-muted-foreground">Anual (11x)</p>
                    <p className="text-sm font-semibold text-muted-foreground">
                      {store.annualPrice > 0 ? formatCurrency(store.annualPrice) : '—'}
                    </p>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">
                  Franquia: {formatCurrency(store.franchise)} · {REGIONS.find(r => r.value === store.region)?.label}
                </p>
              </div>
              {store.monthlyPrice > 0 && (
                <Button className="w-full mt-4" onClick={() => { store.setStep(4); toast.success('Proposta pronta para envio!') }}>
                  Enviar Proposta
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
