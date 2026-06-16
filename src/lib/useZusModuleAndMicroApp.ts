import { useMemo } from 'react'

import type { TAppMeta } from 'zusloader'

import { TErrorWithCause } from './errors'
import { useZusModule } from './useZusModule'
import type {
  TUseZusModuleAndMicroAppOptions,
  TUseZusModuleAndMicroAppResult,
} from './types/zusmodule'

/**
 * 加载 zus-module 并查找指定的 microApp
 * 内部调用 useZusModule，同时返回 microApp meta 数据
 */
export function useZusModuleAndMicroApp(
  options: TUseZusModuleAndMicroAppOptions
): TUseZusModuleAndMicroAppResult {
  const { microAppKey, ...zusModuleOptions } = options

  const { isLoading, zusmodule, error: moduleError } = useZusModule(zusModuleOptions)

  const microApp = useMemo(() => {
    if (!zusmodule) return null
    if (!microAppKey) return null
    return zusmodule.microApps.find((m: TAppMeta) => m.appKey === microAppKey) || null
  }, [zusmodule, microAppKey])

  const error = useMemo(() => {
    if (isLoading) return null

    if (moduleError) {
      return moduleError
    }

    if (!zusmodule) {
      return new TErrorWithCause('ZusModule 加载失败')
    }

    if (!microAppKey) {
      return new TErrorWithCause('未设置 microAppKey')
    }

    if (!microApp) {
      return new TErrorWithCause(`MicroApp 未找到: appKey「${microAppKey}」不存在`)
    }

    return null
  }, [moduleError, isLoading, zusmodule, microAppKey, microApp])

  return {
    isLoading,
    zusmodule,
    microApp,
    error,
  }
}
