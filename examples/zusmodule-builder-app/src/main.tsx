import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { createRoot } from 'react-dom/client'

import './system/global.ts'

import App from './App.tsx'
import { antdTheme } from './theme.ts'

// 先完成 zusloader 登记、registerModule 与初始 updateModuleRoute，再挂载 App
createRoot(document.getElementById('root')!).render(
  <ConfigProvider theme={antdTheme} locale={zhCN}>
    <App />
  </ConfigProvider>
)
