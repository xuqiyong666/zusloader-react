import type { StoreApi } from 'zustand/vanilla'
import type { TAppMeta, THostSDKBase } from 'zusloader'

import { resolveAppLanguage, type AppLanguage } from './microAppControl'
import type { TVueControlActions, TVueControlState } from './types/control'

/** 每次渲染由 useStateRef 更新；actions 调用时读取最新宿主上下文 */
export type MicroAppHostStateRef = {
  navigate: THostSDKBase['navigate']
  basePath: string
  pagePath?: string
  microApp: TAppMeta
}

export function createControlForMicroApp(options: {
  store: StoreApi<TVueControlState>
  stateRef: { current: MicroAppHostStateRef }
}): TVueControlActions {
  const { store, stateRef } = options
  const rootClassName = 'zusmodule-example-host-root'
  const rootStyle = {
    width: '100%',
    height: '100%',
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
  } as const

  return {
    hostNavigate(nextPath, nextParams, replace) {
      stateRef.current.navigate(nextPath, nextParams, replace)
    },
    navigate(nextPath, nextParams = {}, replace) {
      const { navigate, basePath } = stateRef.current
      const normalizedPath = nextPath.startsWith('/') ? nextPath : `/${nextPath}`
      navigate(`${basePath}${normalizedPath}`, nextParams, replace)
    },
    setStatus(status) {
      store.setState((s) => ({ ...s, status }))
    },
    setErrorMsg(message) {
      store.setState((s) => ({ ...s, errorMsg: message }))
    },
    setThemeMode(themeMode) {
      store.setState({ themeMode })
    },
    setTimezone(timezone) {
      store.setState({ timezone })
    },
    setLanguage(language: AppLanguage) {
      store.setState({ language: resolveAppLanguage(language) })
    },
    getRootClassName() {
      return rootClassName
    },
    getRootStyle() {
      return rootStyle
    },
  }
}
