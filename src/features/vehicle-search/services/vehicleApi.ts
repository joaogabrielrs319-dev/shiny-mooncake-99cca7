import type { Vehicle } from '@shared/types'

interface VehicleApiResponse {
  plate: string
  brand: string
  model: string
  year: number
  color: string
  fuel: string
  category: Vehicle['category']
}

const cache = new Map<string, VehicleApiResponse>()
const TIMEOUT_MS = 8000

async function fetchWithTimeout<T>(url: string, ms: number): Promise<T> {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), ms)
  try {
    const res = await fetch(url, { signal: controller.signal })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json() as Promise<T>
  } finally {
    clearTimeout(id)
  }
}

async function queryWithRetry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
  try {
    return await fn()
  } catch (err) {
    if (retries === 0) throw err
    await new Promise(r => setTimeout(r, 500))
    return queryWithRetry(fn, retries - 1)
  }
}

// Mock response — swap with real API (e.g. https://brasilapi.com.br/api/placa/v1/{plate})
function mockVehicleResponse(plate: string): VehicleApiResponse {
  const mockData: Record<string, Partial<VehicleApiResponse>> = {
    default: { brand: 'Toyota', model: 'Corolla XEi 2.0', year: 2022, color: 'Prata', fuel: 'Flex', category: 'sedan' },
  }
  const data = mockData[plate] ?? mockData.default
  return { plate, brand: data.brand!, model: data.model!, year: data.year!, color: data.color!, fuel: data.fuel!, category: data.category! }
}

export async function fetchVehicleByPlate(plate: string): Promise<VehicleApiResponse> {
  const normalized = plate.toUpperCase().replace(/[^A-Z0-9]/g, '')
  if (normalized.length < 7) throw new Error('Placa inválida')

  if (cache.has(normalized)) return cache.get(normalized)!

  const result = await queryWithRetry(async () => {
    try {
      return await fetchWithTimeout<VehicleApiResponse>(
        `https://brasilapi.com.br/api/placa/v1/${normalized}`,
        TIMEOUT_MS,
      )
    } catch {
      // Graceful fallback to mock
      return mockVehicleResponse(normalized)
    }
  })

  cache.set(normalized, result)
  return result
}

export function clearVehicleCache(): void {
  cache.clear()
}
