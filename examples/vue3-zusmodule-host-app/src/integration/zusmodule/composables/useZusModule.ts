import { ref, watch, type Ref } from 'vue'
import { loadModule } from 'zusloader'
import type { TZusModule } from 'zusloader'

import { TErrorWithCause, toError } from '../errors'

export interface UseZusModuleResult {
  isLoading: Ref<boolean>
  zusmodule: Ref<TZusModule | null>
  error: Ref<TErrorWithCause | null>
}

/** 按 manifest URL 拉取并执行 zus-module，从 zusloader 取已注册模块。 */
export function useZusModule(manifestUrl: Ref<string> | string): UseZusModuleResult {
  const isLoading = ref(true)
  const zusmodule = ref<TZusModule | null>(null)
  const error = ref<TErrorWithCause | null>(null)

  const resolveUrl = () => (typeof manifestUrl === 'string' ? manifestUrl : manifestUrl.value)

  watch(
    () => resolveUrl(),
    (url) => {
      isLoading.value = true
      error.value = null
      zusmodule.value = null

      void (async () => {
        try {
          const registered = await loadModule(url)
          zusmodule.value = registered
          isLoading.value = false
        } catch (e) {
          zusmodule.value = null
          error.value = new TErrorWithCause('ZusModule 加载失败', toError(e))
          isLoading.value = false
        }
      })()
    },
    { immediate: true },
  )

  return { isLoading, zusmodule, error }
}
