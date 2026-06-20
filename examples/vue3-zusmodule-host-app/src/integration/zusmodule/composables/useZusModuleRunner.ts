import {
  nextTick,
  onMounted,
  onUnmounted,
  watch,
  type ComputedRef,
  type Ref,
  type ShallowRef,
} from 'vue'
import type { TAppMeta, TZusModule } from 'zusloader'

import { useControlForMicroApp } from './useControlForMicroApp'
import { useSyncMicroAppRouterFromRoute } from './useSyncMicroAppRouterFromRoute'
import { urlToRouterPayload } from '../utils/router'

export interface UseZusModuleRunnerOptions {
  rootDomRef: Ref<HTMLDivElement | null>
  zusmodule: Ref<TZusModule | null> | ShallowRef<TZusModule | null>
  microApp: Ref<TAppMeta | undefined> | ComputedRef<TAppMeta | undefined>
  basePath: Ref<string> | ComputedRef<string>
  pagePath: Ref<string | undefined> | ComputedRef<string | undefined>
}

/** URL 为唯一事实源：path/search 单向同步到 control.store，并挂载 React 子模块。 */
export function useZusModuleRunner(options: UseZusModuleRunnerOptions) {
  const { control } = useControlForMicroApp({
    microApp: options.microApp,
    zusmodule: options.zusmodule,
    basePath: options.basePath,
    pagePath: options.pagePath,
  })

  const searchParamsRef = useSyncMicroAppRouterFromRoute({
    control,
    microApp: options.microApp,
    pagePath: options.pagePath,
  })

  let unmountMicroApp: (() => void) | null = null

  function cleanupMount() {
    unmountMicroApp?.()
    unmountMicroApp = null
  }

  function mountMicroAppInstance() {
    cleanupMount()

    const el = options.rootDomRef.value
    const zusmodule = options.zusmodule.value
    const microApp = options.microApp.value
    const controlValue = control.value

    if (!el || !zusmodule || !microApp || !controlValue) {
      return
    }

    const sp = new URLSearchParams(searchParamsRef.value.toString())
    const { path, params } = urlToRouterPayload(
      options.pagePath.value,
      sp,
      microApp.indexPagePath,
    )
    controlValue.store.setState({ router: { path, params } })

    const result = zusmodule.mountMicroApp({
      mountElement: el,
      microApp,
      control: controlValue,
    })
    unmountMicroApp = result.unmount
  }

  watch(
    () => [options.zusmodule.value, options.microApp.value?.appKey, control.value] as const,
    () => {
      void nextTick(mountMicroAppInstance)
    },
  )

  onMounted(() => {
    void nextTick(mountMicroAppInstance)
  })

  onUnmounted(() => {
    cleanupMount()
  })

  return { control }
}
