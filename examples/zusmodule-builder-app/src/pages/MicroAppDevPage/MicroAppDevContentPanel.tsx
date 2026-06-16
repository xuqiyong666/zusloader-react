import { Alert, Spin } from 'antd'
import { useStore } from 'zustand/react'

import type { TAppMeta } from 'zusloader-react'
import { useMicroAppControl } from 'zusloader-react'

import { MicroAppPlayer } from './MicroAppPlayer.tsx'
import { MICRO_APP_LAZY_ROOT_MAP } from './microAppLazyRootMap.tsx'

interface Props {
  microApp: TAppMeta
}

/** 订阅 router.store 的入口状态，负责 loading / error 展示；实际挂载交给 MicroAppPlayer */
export function MicroAppDevContentPanel({ microApp }: Props) {
  const { store } = useMicroAppControl()
  const status = useStore(store, (s) => s.status)
  const errorMsg = useStore(store, (s) => s.errorMsg)

  const lazyRoot = MICRO_APP_LAZY_ROOT_MAP[microApp.appKey] ?? null

  return (
    <>
      {errorMsg ? (
        <Alert
          type="error"
          showIcon
          message={errorMsg}
          style={{ marginBottom: 16 }}
        />
      ) : null}
      {!errorMsg && status === 'loading' ? (
        <div style={{ marginBottom: 16, width: '100%', minHeight: "300px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Spin tip="加载中…" />
        </div>
      ) : null}
      <MicroAppPlayer microApp={microApp} lazyRoot={lazyRoot} />
    </>
  )
}
