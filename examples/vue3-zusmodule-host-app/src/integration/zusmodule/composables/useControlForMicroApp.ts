import { shallowRef, watch, type ComputedRef, type Ref } from 'vue'
import { createStore } from 'zustand/vanilla'
import type { TAppMeta, TZusModule } from 'zusloader'

import { createControlForMicroApp } from '../createControlForMicroApp'
import { DEFAULT_APP_LANGUAGE } from '../microAppControl'
import type { TVueControlSDK, TVueControlState } from '../types/control'
import { useNavigateForMicroApp } from './useNavigateForMicroApp'
import { useStateRef } from './useStateRef'

export interface UseControlForMicroAppOptions {
  microApp: Ref<TAppMeta | undefined> | ComputedRef<TAppMeta | undefined>
  zusmodule: Ref<TZusModule | null> | ComputedRef<TZusModule | null>
  basePath: Ref<string> | ComputedRef<string>
  pagePath: Ref<string | undefined> | ComputedRef<string | undefined>
}

export function useControlForMicroApp(options: UseControlForMicroAppOptions) {
  const navigate = useNavigateForMicroApp()
  const control = shallowRef<TVueControlSDK | null>(null)

  const stateRef = useStateRef(() => {
    const microApp = options.microApp.value
    if (!microApp) {
      return {
        navigate,
        basePath: options.basePath.value,
        pagePath: options.pagePath.value,
        microApp: {} as TAppMeta,
      }
    }

    return {
      navigate,
      basePath: options.basePath.value,
      pagePath: options.pagePath.value,
      microApp,
    }
  })

  watch(
    () => [
      options.microApp.value?.appKey,
      options.microApp.value?.indexPagePath,
      options.zusmodule.value?.moduleKey,
      options.basePath.value,
    ] as const,
    () => {
      const microApp = options.microApp.value
      const zusmodule = options.zusmodule.value
      const basePath = options.basePath.value

      if (!microApp || !zusmodule || !basePath) {
        control.value = null
        return
      }

      const store = createStore<TVueControlState>(() => ({
        router: {
          path: microApp.indexPagePath,
          params: {},
        },
        basePath,
        status: 'idle',
        errorMsg: undefined,
        themeMode: 'light',
        timezone: 'Asia/Shanghai',
        language: DEFAULT_APP_LANGUAGE,
      }))

      const actions = createControlForMicroApp({ store, stateRef })
      control.value = { store, actions }
    },
    { immediate: true },
  )

  return { control, stateRef }
}
