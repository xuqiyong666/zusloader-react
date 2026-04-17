import React from 'react'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { createRoot } from 'react-dom/client'

import zusloader, {
  type MountMicroAppOptions,
  type MountMicroAppResult,
  type ZusModule,
} from '@xuqiyong666/zusloader'
import { MicroAppControlProvider } from '@xuqiyong666/zusloader-react'

import { MicroAppPlayer } from '../pages/MicroAppDevPage/MicroAppPlayer.tsx'
import { microApps } from '../metadata.ts'

import '../system/global.ts'
import { antdTheme } from '../theme.ts'
import { MICRO_APP_LAZY_ROOT_MAP } from '../pages/MicroAppDevPage/microAppLazyRootMap.tsx'
import { ZUS_MODULE_KEY } from '../system/zusmoduleKey.ts'

/** zus-module 宿主挂载入口：不含开发壳 App / react-router，按传入的 MicroApp 挂载 */
function mountMicroApp(
  options: MountMicroAppOptions
): MountMicroAppResult {
  const { mountElement, microApp, control } = options

  const root = createRoot(mountElement)

  const lazyRoot = MICRO_APP_LAZY_ROOT_MAP[microApp.appKey] ?? null

  root.render(
    <ConfigProvider theme={antdTheme} locale={zhCN}>
      <MicroAppControlProvider control={control}>
        <MicroAppPlayer microApp={microApp} lazyRoot={lazyRoot} />
      </MicroAppControlProvider>
    </ConfigProvider>
  )
  return {
    unmount: () => {
      root.unmount()
    },
  }
}

const zusModule: ZusModule = {
  moduleKey: ZUS_MODULE_KEY,
  displayName: 'Demo ZusModule',
  microApps,
  mountMicroApp,
  getConfig: () => ({}),
  updateConfig: () => {}
}

zusloader.registerZusModule(zusModule)

export default zusModule
