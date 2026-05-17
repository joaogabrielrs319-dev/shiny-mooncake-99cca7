import { useEffect, useRef, useState } from 'react'
import { supabase } from '@shared/lib/supabase'
import type { OnlineClient } from '@shared/types'

export function useRealtimePresence(channelName: string) {
  const [onlineClients, setOnlineClients] = useState<OnlineClient[]>([])
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  useEffect(() => {
    const ch = supabase.channel(channelName, {
      config: { presence: { key: crypto.randomUUID() } },
    })

    ch.on('presence', { event: 'sync' }, () => {
      const state = ch.presenceState<OnlineClient>()
      const clients = Object.values(state).flat()
      setOnlineClients(clients)
    })

    ch.subscribe()
    channelRef.current = ch

    return () => {
      ch.unsubscribe()
    }
  }, [channelName])

  return { onlineClients }
}
