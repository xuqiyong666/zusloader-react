import { useContext, useMemo, type ReactNode } from 'react'

import type { MicroAppControlSDK } from 'zusloader'

import { MicroAppControlContext } from './MicroAppControlContext'
import type { MicroAppControlContextValue } from './types'

interface ProviderProps {
  control: MicroAppControlSDK
  children: ReactNode
}

export function MicroAppControlProvider({ control, children }: ProviderProps) {
  const contextValue = useMemo(
    (): MicroAppControlContextValue => ({
      store: control.store,
      actions: control.actions,
    }),
    [control.store, control.actions]
  )

  return (
    <MicroAppControlContext.Provider value={contextValue}>
      {children}
    </MicroAppControlContext.Provider>
  )
}

export function useMicroAppControl(): MicroAppControlContextValue {
  const ctx = useContext(MicroAppControlContext)
  if (!ctx) {
    throw new Error('useMicroAppControl must be used within MicroAppControlProvider')
  }
  return ctx
}
