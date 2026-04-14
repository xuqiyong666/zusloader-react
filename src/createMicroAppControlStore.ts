import { createStore } from 'zustand/vanilla'
import type { StoreApi } from 'zustand/vanilla'

import type {
  MicroAppControlExtraState,
  MicroAppControlState,
  MicroAppRouter,
} from '@xuqiyong666/zusloader'

export function createMicroAppControlStore<
  TExtraState extends MicroAppControlExtraState = {},
>(
  initial: Partial<MicroAppRouter> & {
    basePath: string
    initialState?: TExtraState
  }
): StoreApi<MicroAppControlState<TExtraState>> {
  return createStore<MicroAppControlState<TExtraState>>(() => {
    const baseState = {
      router: {
        path: initial.path ?? '/',
        params: initial.params,
      },
      basePath: initial.basePath,
      status: 'idle' as const,
      errorMsg: undefined,
      ...(initial.initialState ?? {}),
    }
    return baseState as MicroAppControlState<TExtraState>
  })
}
