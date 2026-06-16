import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'

import {
  createReactMountMicroApp,
  defineReactZusModule,
  registerReactZusModule,
} from 'zusloader-react'

import { MicroAppPlayer } from '../pages/MicroAppDevPage/MicroAppPlayer.tsx'
import { microApps } from '../metadata.ts'

import '../system/global.ts'
import { antdTheme } from '../theme.ts'
import { MICRO_APP_LAZY_ROOT_MAP } from '../pages/MicroAppDevPage/microAppLazyRootMap.tsx'
import { ZUS_MODULE_KEY } from '../system/zusmoduleKey.ts'

const mountMicroApp = createReactMountMicroApp(({ microApp }) => (
  <ConfigProvider theme={antdTheme} locale={zhCN}>
    <MicroAppPlayer
      microApp={microApp}
      lazyRoot={MICRO_APP_LAZY_ROOT_MAP[microApp.appKey] ?? null}
    />
  </ConfigProvider>
))

const zusModule = defineReactZusModule({
  moduleKey: ZUS_MODULE_KEY,
  displayName: 'Demo ZusModule',
  microApps,
  mountMicroApp,
  getConfig: () => ({}),
  updateConfig: () => {},
})

registerReactZusModule(zusModule)

export default zusModule
