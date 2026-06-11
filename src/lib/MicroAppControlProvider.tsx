import { useContext, type ReactNode } from 'react';

import { MicroAppControlContext } from './MicroAppControlContext';
import type { TControlSDK, TExtraActions, TExtraState } from './types/control';

interface ProviderProps<
  TState extends TExtraState = TExtraState,
  TActions extends TExtraActions = TExtraActions,
> {
  control: TControlSDK<TState, TActions>;
  children: ReactNode;
}

export function MicroAppControlProvider<
  TState extends TExtraState = TExtraState,
  TActions extends TExtraActions = TExtraActions,
>({ control, children }: ProviderProps<TState, TActions>) {
  return (
    <MicroAppControlContext.Provider value={control}>
      {children}
    </MicroAppControlContext.Provider>
  );
}

export function useMicroAppControl<
  TState extends TExtraState = TExtraState,
  TActions extends TExtraActions = TExtraActions,
>(): TControlSDK<TState, TActions> {
  const ctx = useContext(MicroAppControlContext);
  if (!ctx) {
    throw new Error('useMicroAppControl must be used within MicroAppControlContext.Provider');
  }
  return ctx as TControlSDK<TState, TActions>;
}
