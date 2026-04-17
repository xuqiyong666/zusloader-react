import { useLayoutEffect, type ReactNode } from "react"
import { useMicroAppControl } from "@xuqiyong666/zusloader-react"

/**
 * lazy 子树 commit 后写 `ready`，卸载时写 `idle`（与 `MicroAppMount` 的 loading/error 分工）。
 */
export function LazyCommittedNotifier({ children }: { children: ReactNode }) {
  const { actions } = useMicroAppControl()

  useLayoutEffect(() => {
    actions.setStatus('ready')
  }, [actions])

  return children
}