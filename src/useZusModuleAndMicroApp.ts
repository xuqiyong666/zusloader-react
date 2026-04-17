import { useMemo } from 'react'

import type { MicroAppMeta, ZusModule } from '@xuqiyong666/zusloader'

import { useZusModule, type UseZusModuleOptions } from './useZusModule'

export interface UseZusModuleAndMicroAppOptions extends UseZusModuleOptions {
  /** 微应用 appKey */
  microAppKey: string
}

export interface UseZusModuleAndMicroAppResult {
  status: 'loading' | 'ready' | 'error'
  zusmodule: ZusModule | null
  microApp: MicroAppMeta | null
  errorMessage: string | null
}

/**
 * 加载 zus-module 并查找指定的 microApp
 * 内部调用 useZusModule，同时返回 microApp meta 数据
 */
export function useZusModuleAndMicroApp(
  options: UseZusModuleAndMicroAppOptions
): UseZusModuleAndMicroAppResult {
  const { microAppKey, ...zusModuleOptions } = options

  const { status, zusmodule, errorMessage } = useZusModule(zusModuleOptions)

  const microApp = useMemo(() => {
    if (!zusmodule) return null
    return zusmodule.microApps.find((m) => m.appKey === microAppKey) || null
  }, [zusmodule, microAppKey])

  return {
    status,
    zusmodule,
    microApp,
    errorMessage: errorMessage || (microApp ? null : `未找到 appKey 为「${microAppKey}」的 MicroApp`),
  }
}
