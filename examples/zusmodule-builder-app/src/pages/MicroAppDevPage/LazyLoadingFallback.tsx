import { useLayoutEffect } from "react"
import { useMicroAppControl } from "zusloader-react"

/** `Suspense` fallback 挂载期间表示入口代码仍在加载 */
export function LazyLoadingFallback() {
  const { actions } = useMicroAppControl()

  useLayoutEffect(() => {
    actions.setStatus('loading')
  }, [actions])

  return null
}