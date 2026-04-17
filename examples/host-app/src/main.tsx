import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App.tsx'

import './index.css'

createRoot(document.getElementById('root')!).render(
  <ConfigProvider locale={zhCN}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ConfigProvider>
)
