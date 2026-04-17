import { useContext, type ReactNode } from 'react'

import type { MicroAppControlSDK } from '@xuqiyong666/zusloader'

import { MicroAppControlContext } from './MicroAppControlContext'
import type { MicroAppControlContextValue } from './controlTypes'

interface ProviderProps<
  TExtraState extends Record<string, unknown> = {},
  TExtraActions extends Record<string, unknown> | void = void,
> {
  control: MicroAppControlSDK<TExtraState, TExtraActions>
  children: ReactNode
}

export function MicroAppControlProvider<
  TExtraState extends Record<string, unknown> = {},
  TExtraActions extends Record<string, unknown> | void = void,
>({ control, children }: ProviderProps<TExtraState, TExtraActions>) {
  return (
    <MicroAppControlContext.Provider value={control as unknown as MicroAppControlSDK}>
      {children}
    </MicroAppControlContext.Provider>
  )
}

export function useMicroAppControl<
  TExtraState extends Record<string, unknown> = {},
  TExtraActions extends Record<string, unknown> | void = void,
>(): MicroAppControlContextValue<TExtraState, TExtraActions> {
  const ctx = useContext(MicroAppControlContext)
  if (!ctx) {
    throw new Error('useMicroAppControl must be used within MicroAppControlContext.Provider')
  }
  return ctx as unknown as MicroAppControlContextValue<TExtraState, TExtraActions>
}
