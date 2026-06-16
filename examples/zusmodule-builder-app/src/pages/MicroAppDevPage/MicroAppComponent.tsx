import { Suspense, useLayoutEffect, type ReactNode } from 'react'
import type { TAppMeta } from 'zusloader-react'
import { useMicroAppControl } from 'zusloader-react'

import type { MicroAppLazyRoot } from './microAppLazyRootMap.tsx'
import { LazyLoadingFallback } from './LazyLoadingFallback.tsx'
import { LazyCommittedNotifier } from './LazyCommittedNotifier.tsx'

export interface MicroAppComponentProps {
  lazyRoot: MicroAppLazyRoot
  microApp: TAppMeta
}

/**
 * 单微应用加载单元：`Suspense` 满足 `lazy` 规范（`fallback` 恒为 null），
 * 就绪/卸载通过 `actions.setStatus` 写入 `router.store`。
 */
export function MicroAppComponent({
  lazyRoot: LazyRoot,
  microApp,
}: MicroAppComponentProps) {
  const control = useMicroAppControl()

  return (
    <Suspense fallback={<LazyLoadingFallback />}>
      <LazyCommittedNotifier>
        <LazyRoot control={control} microApp={microApp} />
      </LazyCommittedNotifier>
    </Suspense>
  )
}
