import { supabase } from '@shared/lib/supabase'
import type { TrackingEvent } from '@shared/types'

const BATCH_INTERVAL = 3000
const MAX_BATCH = 20

let queue: TrackingEvent[] = []
let timer: ReturnType<typeof setTimeout> | null = null
let sessionStart = Date.now()
let lastActivity = Date.now()

function flush(): void {
  if (queue.length === 0) return
  const batch = queue.splice(0, MAX_BATCH)
  supabase.from('tracking_events').insert(batch).then(() => {})
}

function scheduleBatch(): void {
  if (timer) return
  timer = setTimeout(() => {
    timer = null
    flush()
  }, BATCH_INTERVAL)
}

export function track(event: Omit<TrackingEvent, 'timestamp'>): void {
  lastActivity = Date.now()
  queue.push({ ...event, timestamp: lastActivity })
  if (queue.length >= MAX_BATCH) {
    if (timer) clearTimeout(timer)
    timer = null
    flush()
  } else {
    scheduleBatch()
  }
}

export function getSessionDuration(): number {
  return Math.round((Date.now() - sessionStart) / 1000)
}

export function getIdleTime(): number {
  return Math.round((Date.now() - lastActivity) / 1000)
}

export function resetSession(): void {
  sessionStart = Date.now()
  lastActivity = Date.now()
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', flush)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush()
  })
}
