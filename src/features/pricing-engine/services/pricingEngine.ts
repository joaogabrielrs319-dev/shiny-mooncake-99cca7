import type { VehicleCategory, RegionType, PricingConfig } from '@shared/types'

const DEFAULT_CONFIG: PricingConfig = {
  base_rate: 0.032,
  category_multipliers: {
    hatch: 0.95, sedan: 1.0, suv: 1.15, pickup: 1.2,
    van: 1.25, truck: 1.35, moto: 0.85,
  },
  region_multipliers: {
    'norte': 1.12,
    'nordeste': 1.08,
    'centro-oeste': 1.05,
    'sul-sudeste': 1.0,
  },
  year_multipliers: {
    '0-2': 1.0, '3-5': 0.95, '6-8': 0.90, '9+': 0.85,
  },
  franchise_discounts: {
    '1000': 0.0, '1500': -0.03, '2000': -0.06,
    '2500': -0.09, '3000': -0.12, '4000': -0.16, '5000': -0.20,
  },
  addon_prices: {
    'carro-reserva': 18, 'assistencia-24h': 12,
    'vidros': 15, 'terceiros': 22, 'rastreador': 25,
  },
}

function getYearBracket(year: number): string {
  const age = new Date().getFullYear() - year
  if (age <= 2) return '0-2'
  if (age <= 5) return '3-5'
  if (age <= 8) return '6-8'
  return '9+'
}

export interface PricingInput {
  fipe_value: number
  category: VehicleCategory
  region: RegionType
  year: number
  franchise: number
  selected_addons: string[]
  plan: 'basic' | 'standard' | 'premium'
}

const PLAN_MULTIPLIERS = { basic: 0.75, standard: 1.0, premium: 1.25 }

export function calculatePrice(input: PricingInput, config: PricingConfig = DEFAULT_CONFIG): {
  monthly: number
  annual: number
  breakdown: Record<string, number>
} {
  const base = input.fipe_value * config.base_rate
  const catMult = config.category_multipliers[input.category] ?? 1
  const regionMult = config.region_multipliers[input.region] ?? 1
  const yearMult = config.year_multipliers[getYearBracket(input.year)] ?? 1
  const franqDiscount = config.franchise_discounts[String(input.franchise)] ?? 0
  const planMult = PLAN_MULTIPLIERS[input.plan]

  const addonTotal = input.selected_addons.reduce((sum, id) => {
    return sum + (config.addon_prices[id] ?? 0)
  }, 0)

  const base_monthly = base * catMult * regionMult * yearMult * (1 + franqDiscount) * planMult
  const monthly = Math.round((base_monthly + addonTotal) * 100) / 100
  const annual = Math.round(monthly * 11 * 100) / 100 // 1 month free

  return {
    monthly,
    annual,
    breakdown: {
      base: Math.round(base_monthly * 100) / 100,
      addons: addonTotal,
      discount: Math.round(base_monthly * Math.abs(franqDiscount) * 100) / 100,
    },
  }
}
