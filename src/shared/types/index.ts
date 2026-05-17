export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'consultant'
  avatar_url?: string
  created_at: string
}

export interface Vehicle {
  plate: string
  brand: string
  model: string
  year: number
  color: string
  fuel: string
  category: VehicleCategory
  fipe_code: string
  fipe_value: number
}

export type VehicleCategory = 'hatch' | 'sedan' | 'suv' | 'pickup' | 'van' | 'truck' | 'moto'

export interface Coverage {
  id: string
  name: string
  description: string
  icon: string
  base_price: number
  enabled: boolean
}

export interface Proposal {
  id: string
  client_name: string
  client_phone: string
  client_email?: string
  vehicle: Vehicle
  coverages: string[]
  plan: PlanType
  franchise_value: number
  region: RegionType
  monthly_price: number
  annual_price: number
  status: ProposalStatus
  consultant_id: string
  tracking_token: string
  sent_at?: string
  viewed_at?: string
  created_at: string
  updated_at: string
}

export type PlanType = 'basic' | 'standard' | 'premium'
export type RegionType = 'norte' | 'nordeste' | 'centro-oeste' | 'sul-sudeste'
export type ProposalStatus = 'draft' | 'sent' | 'viewed' | 'negotiating' | 'hot' | 'closed' | 'lost'

export interface Lead {
  id: string
  proposal_id: string
  client_name: string
  client_phone: string
  vehicle_model: string
  vehicle_plate: string
  fipe_value: number
  monthly_price: number
  status: ProposalStatus
  conversion_score: number
  time_on_proposal: number
  last_section: string
  created_at: string
  updated_at: string
}

export interface TrackingEvent {
  type: 'page_view' | 'section_enter' | 'section_exit' | 'coverage_toggle' | 'cta_click' | 'plan_change' | 'franchise_change'
  proposal_id: string
  section?: string
  payload?: Record<string, unknown>
  timestamp: number
}

export interface OnlineClient {
  proposal_id: string
  client_name: string
  current_section: string
  time_active: number
  conversion_score: number
  last_interaction: string
}

export interface PricingConfig {
  base_rate: number
  category_multipliers: Record<VehicleCategory, number>
  region_multipliers: Record<RegionType, number>
  year_multipliers: Record<string, number>
  franchise_discounts: Record<string, number>
  addon_prices: Record<string, number>
}
