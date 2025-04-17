import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { Session } from '@supabase/supabase-js'

type SessionContextType = {
  session: Session | null
  isLoading: boolean
}

const SessionContext = createContext<SessionContextType>({
  session: null,
  isLoading: true,
})

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setIsLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  return (
    <SessionContext.Provider value={{ session, isLoading }}>
      {children}
    </SessionContext.Provider>
  )
}

export const useSession = () => useContext(SessionContext)