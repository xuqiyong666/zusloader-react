import { useLayoutEffect } from 'react'

import type { MicroAppMeta } from '@xuqiyong666/zusloader'
import { useMicroAppControl } from '@xuqiyong666/zusloader-react'

import { MicroAppComponent } from './MicroAppComponent.tsx'
import { type MicroAppLazyRoot } from './microAppLazyRootMap.tsx'

interface Props {
  microApp: MicroAppMeta
  lazyRoot: MicroAppLazyRoot | null
}

/**
 * 按 manifest.appKey 查表挂载入口；加载/错误展示由宿主读 `router.store`。
 */
export function MicroAppPlayer({ microApp, lazyRoot }: Props) {
  const { actions } = useMicroAppControl()
  const appKey = microApp.appKey
  const hasEntry = lazyRoot != null

  useLayoutEffect(() => {
    if (!hasEntry) {
      actions.setErrorMsg(`未为「${appKey}」配置 MicroApp 入口组件。`)
      actions.setStatus('idle')
    } else {
      actions.setErrorMsg(undefined)
    }
  }, [actions, appKey, hasEntry])

  if (!hasEntry || !lazyRoot) {
    return null
  }

  return <MicroAppComponent lazyRoot={lazyRoot} microApp={microApp} />
}
