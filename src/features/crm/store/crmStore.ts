import { create } from 'zustand'
import type { Lead, ProposalStatus } from '@shared/types'

interface CrmState {
  leads: Lead[]
  selectedLead: Lead | null
  filter: ProposalStatus | 'all'
  setLeads: (leads: Lead[]) => void
  updateLeadStatus: (id: string, status: ProposalStatus) => void
  setSelectedLead: (lead: Lead | null) => void
  setFilter: (filter: ProposalStatus | 'all') => void
}

export const useCrmStore = create<CrmState>((set, get) => ({
  leads: [],
  selectedLead: null,
  filter: 'all',

  setLeads: (leads) => set({ leads }),

  updateLeadStatus: (id, status) => {
    set({
      leads: get().leads.map(l => l.id === id ? { ...l, status } : l),
    })
  },

  setSelectedLead: (lead) => set({ selectedLead: lead }),

  setFilter: (filter) => set({ filter }),
}))
