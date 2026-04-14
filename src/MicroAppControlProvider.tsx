import { useContext, useMemo, type ReactNode } from 'react'

import type {
  HostSDKBase,
  MicroAppControlExtraState,
  MicroAppControlSDK,
} from '@xuqiyong666/zusloader'

import { MicroAppControlContext } from './MicroAppControlContext'
import type { MicroAppControlContextValue } from './types'

interface ProviderProps<
  THost extends HostSDKBase = HostSDKBase,
  TExtraState extends MicroAppControlExtraState = {},
> {
  control: MicroAppControlSDK<THost, TExtraState>
  children: ReactNode
}

export function MicroAppControlProvider<
  THost extends HostSDKBase = HostSDKBase,
  TExtraState extends MicroAppControlExtraState = {},
>({ control, children }: ProviderProps<THost, TExtraState>) {
  const contextValue = useMemo(
    (): MicroAppControlContextValue<THost, TExtraState> => ({
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

export function useMicroAppControl<
  THost extends HostSDKBase = HostSDKBase,
  TExtraState extends MicroAppControlExtraState = {},
>(): MicroAppControlContextValue<THost, TExtraState> {
  const ctx = useContext(MicroAppControlContext)
  if (!ctx) {
    throw new Error('useMicroAppControl must be used within MicroAppControlProvider')
  }
  return ctx as unknown as MicroAppControlContextValue<THost, TExtraState>
}
