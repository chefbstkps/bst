import { createContext, useContext, useState, ReactNode } from 'react'

interface PerformanceSettingsContextType {
  enableAnimations: boolean
  setEnableAnimations: (enabled: boolean) => void
  enableNotifications: boolean
  setEnableNotifications: (enabled: boolean) => void
  autoRefresh: boolean
  setAutoRefresh: (enabled: boolean) => void
  refreshInterval: number
  setRefreshInterval: (interval: number) => void
}

const PerformanceSettingsContext = createContext<PerformanceSettingsContextType | undefined>(undefined)

interface PerformanceSettingsProviderProps {
  children: ReactNode
}

export function PerformanceSettingsProvider({ children }: PerformanceSettingsProviderProps) {
  const [enableAnimations, setEnableAnimations] = useState(true)
  const [enableNotifications, setEnableNotifications] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [refreshInterval, setRefreshInterval] = useState(30000) // 30 seconds

  return (
    <PerformanceSettingsContext.Provider
      value={{
        enableAnimations,
        setEnableAnimations,
        enableNotifications,
        setEnableNotifications,
        autoRefresh,
        setAutoRefresh,
        refreshInterval,
        setRefreshInterval,
      }}
    >
      {children}
    </PerformanceSettingsContext.Provider>
  )
}

export function usePerformanceSettings() {
  const context = useContext(PerformanceSettingsContext)
  if (context === undefined) {
    throw new Error('usePerformanceSettings must be used within a PerformanceSettingsProvider')
  }
  return context
}
