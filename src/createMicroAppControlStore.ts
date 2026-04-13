import { createStore } from 'zustand/vanilla'
import type { StoreApi } from 'zustand'

import type { MicroAppControlState, MicroAppRouter } from 'zusloader'

export function createMicroAppControlStore(
  initial: Partial<MicroAppRouter>
): StoreApi<MicroAppControlState> {
  return createStore<MicroAppControlState>(() => ({
    router: {
      path: initial.path ?? '/',
      params: initial.params,
    },
    status: 'idle',
    errorMsg: undefined,
  }))
}
