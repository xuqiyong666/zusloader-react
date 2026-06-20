import { ref, watch, type ComputedRef, type Ref, type ShallowRef } from 'vue'
import { useRoute } from 'vue-router'
import type { TAppMeta } from 'zusloader'

import type { TVueControlSDK } from '../types/control'
import { routeQueryToSearchParams, shallowEqual, urlToRouterPayload } from '../utils/router'

export interface UseSyncMicroAppRouterFromRouteOptions {
  control: Ref<TVueControlSDK | null> | ShallowRef<TVueControlSDK | null>
  microApp: Ref<TAppMeta | undefined> | ComputedRef<TAppMeta | undefined>
  pagePath: Ref<string | undefined> | ComputedRef<string | undefined>
}

/**
 * 须在 vue-router 子树内使用。
 * 返回的 ref 与当前 URL 查询同步，供挂载首帧读取。
 */
export function useSyncMicroAppRouterFromRoute(options: UseSyncMicroAppRouterFromRouteOptions) {
  const route = useRoute()
  const searchParamsRef = ref(new URLSearchParams())

  watch(
    () => [
      route.fullPath,
      options.pagePath.value,
      options.microApp.value?.appKey,
      options.microApp.value?.indexPagePath,
      options.control.value,
    ] as const,
    () => {
      const sp = routeQueryToSearchParams(route.query)
      searchParamsRef.value = sp

      const control = options.control.value
      const microApp = options.microApp.value
      if (!control || !microApp) {
        return
      }

      const { path, params } = urlToRouterPayload(
        options.pagePath.value,
        sp,
        microApp.indexPagePath,
      )
      const cur = control.store.getState()
      const curParams = cur.router.params ?? {}
      if (cur.router.path === path && shallowEqual(curParams, params)) {
        return
      }

      control.store.setState({ router: { path, params } })
    },
    { immediate: true },
  )

  return searchParamsRef
}
