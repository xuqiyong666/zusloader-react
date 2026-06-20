import type * as React from 'react'
import type * as ReactDOMClient from 'react-dom/client'

/**
 * 主应用提供的共享运行时，子应用构建 external 后从此处取引用。
 * 未安装的库可先占位为 optional，接入时再收紧类型。
 */
export interface MainAppShareLibs {
  react: typeof React
  reactDomClient: typeof ReactDOMClient
  axios?: unknown
  lodash?: unknown
  dayjs?: unknown
}
