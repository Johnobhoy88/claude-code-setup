// frontend/src/app/providers/GlobalProvider.tsx
'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface GlobalContextType {
  userEmail: string | null;
  setUserEmail: (email: string | null) => void;
  userToken: string | null;
  setUserToken: (token: string | null) => void;
  userTier: string | null;
  setUserTier: (tier: string | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined)

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userToken, setUserToken] = useState<string | null>(null)
  const [userTier, setUserTier] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Check for stored user data on initial load
  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail')
    const storedToken = localStorage.getItem('userToken')
    const storedTier = localStorage.getItem('userTier')
    
    if (storedEmail) setUserEmail(storedEmail)
    if (storedToken) setUserToken(storedToken)
    if (storedTier) setUserTier(storedTier)
  }, [])

  // Update localStorage when user data changes
  useEffect(() => {
    if (userEmail) {
      localStorage.setItem('userEmail', userEmail)
    } else {
      localStorage.removeItem('userEmail')
    }
  }, [userEmail])

  useEffect(() => {
    if (userToken) {
      localStorage.setItem('userToken', userToken)
    } else {
      localStorage.removeItem('userToken')
    }
  }, [userToken])

  useEffect(() => {
    if (userTier) {
      localStorage.setItem('userTier', userTier)
    } else {
      localStorage.removeItem('userTier')
    }
  }, [userTier])

  return (
    <GlobalContext.Provider value={{
      userEmail,
      setUserEmail,
      userToken,
      setUserToken,
      userTier,
      setUserTier,
      isLoading,
      setIsLoading
    }}>
      {children}
    </GlobalContext.Provider>
  )
}

export function useGlobal() {
  const context = useContext(GlobalContext)
  if (context === undefined) {
    throw new Error('useGlobal must be used within a GlobalProvider')
  }
  return context
}