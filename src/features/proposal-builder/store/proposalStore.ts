import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { Vehicle, PlanType, RegionType } from '@shared/types'
import { calculatePrice } from '@features/pricing-engine/services/pricingEngine'

interface ProposalDraft {
  clientName: string
  clientPhone: string
  clientEmail: string
  vehicle: Vehicle | null
  selectedCoverages: string[]
  selectedAddons: string[]
  plan: PlanType
  franchise: number
  region: RegionType
  monthlyPrice: number
  annualPrice: number
  step: 1 | 2 | 3 | 4
}

interface ProposalActions {
  setClient: (name: string, phone: string, email?: string) => void
  setVehicle: (vehicle: Vehicle) => void
  toggleCoverage: (id: string) => void
  toggleAddon: (id: string) => void
  setPlan: (plan: PlanType) => void
  setFranchise: (value: number) => void
  setRegion: (region: RegionType) => void
  setStep: (step: ProposalDraft['step']) => void
  recalculate: () => void
  reset: () => void
}

const INITIAL: ProposalDraft = {
  clientName: '',
  clientPhone: '',
  clientEmail: '',
  vehicle: null,
  selectedCoverages: ['colisao', 'roubo', 'incendio'],
  selectedAddons: [],
  plan: 'premium',
  franchise: 2500,
  region: 'sul-sudeste',
  monthlyPrice: 0,
  annualPrice: 0,
  step: 1,
}

export const useProposalStore = create<ProposalDraft & ProposalActions>()(
  subscribeWithSelector((set, get) => ({
    ...INITIAL,

    setClient: (clientName, clientPhone, clientEmail = '') =>
      set({ clientName, clientPhone, clientEmail }),

    setVehicle: (vehicle) => {
      set({ vehicle })
      get().recalculate()
    },

    toggleCoverage: (id) => {
      const curr = get().selectedCoverages
      const next = curr.includes(id) ? curr.filter(c => c !== id) : [...curr, id]
      set({ selectedCoverages: next })
      get().recalculate()
    },

    toggleAddon: (id) => {
      const curr = get().selectedAddons
      const next = curr.includes(id) ? curr.filter(a => a !== id) : [...curr, id]
      set({ selectedAddons: next })
      get().recalculate()
    },

    setPlan: (plan) => {
      set({ plan })
      get().recalculate()
    },

    setFranchise: (franchise) => {
      set({ franchise })
      get().recalculate()
    },

    setRegion: (region) => {
      set({ region })
      get().recalculate()
    },

    setStep: (step) => set({ step }),

    recalculate: () => {
      const { vehicle, plan, franchise, region, selectedAddons } = get()
      if (!vehicle) return
      const { monthly, annual } = calculatePrice({
        fipe_value: vehicle.fipe_value,
        category: vehicle.category,
        region,
        year: vehicle.year,
        franchise,
        selected_addons: selectedAddons,
        plan,
      })
      set({ monthlyPrice: monthly, annualPrice: annual })
    },

    reset: () => set(INITIAL),
  })),
)
