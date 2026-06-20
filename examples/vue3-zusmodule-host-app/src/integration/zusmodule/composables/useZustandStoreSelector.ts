import { ref, watch, type Ref, type ShallowRef } from 'vue'
import type { StoreApi } from 'zustand/vanilla'

export function useZustandStoreSelector<TState, TSelected>(
  storeRef: Ref<StoreApi<TState> | null | undefined> | ShallowRef<StoreApi<TState> | null | undefined>,
  selector: (state: TState) => TSelected,
) {
  const selected = ref(selector(getFallbackState(storeRef.value)))

  watch(
    () => storeRef.value,
    (store, _, onCleanup) => {
      if (!store) {
        selected.value = selector(getFallbackState(null))
        return
      }

      selected.value = selector(store.getState())
      const unsub = store.subscribe((state) => {
        selected.value = selector(state)
      })
      onCleanup(unsub)
    },
    { immediate: true },
  )

  return selected
}

function getFallbackState<TState>(store: StoreApi<TState> | null | undefined): TState {
  if (store) {
    return store.getState()
  }

  return {} as TState
}
