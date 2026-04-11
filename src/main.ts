import { DEFAULT_ZUS_LOADER_GLOBAL_KEY } from './constants'

import type { ZusLoaderApi, ZusModule } from './types/zusmodule'

function getBrowserWindow(): Window | undefined {
  if (typeof window === 'undefined') {
    return undefined
  }
  return window
}

function createZusLoaderApi(): ZusLoaderApi {
  const modules: Record<string, ZusModule> = Object.create(null)
  return {
    modules,
    registerZusModule(zusModule: ZusModule) {
      if (modules[zusModule.moduleKey]) {
        console.warn(
          `[zusloader] replacing registered module: ${zusModule.moduleKey}`
        )
      }
      modules[zusModule.moduleKey] = zusModule
    },
    getRegisteredZusModule(moduleKey: string) {
      return modules[moduleKey]
    },
    listRegisteredZusModules() {
      return Object.values(modules)
    },
  }
}

/**
 * 取得或初始化 `window[globalKey]` 上的 zusloader 单例（与子模块 manifest 约定一致）。
 */
export function getOrCreateZusLoaderSingleton(
  globalKey: string = DEFAULT_ZUS_LOADER_GLOBAL_KEY
): ZusLoaderApi {
  const win = getBrowserWindow()
  if (!win) {
    throw new Error(
      'getOrCreateZusLoaderSingleton: no browser `window` (must run in a client environment).'
    )
  }
  const carrier = win as unknown as Record<string, unknown>
  const existing = carrier[globalKey] as ZusLoaderApi | undefined
  if (existing && typeof existing.registerZusModule === 'function') {
    return existing
  }
  const api = createZusLoaderApi()
  carrier[globalKey] = api
  return api
}

/** 默认使用 `DEFAULT_ZUS_LOADER_GLOBAL_KEY`；与 `getOrCreateZusLoaderSingleton()` 操作同一单例 */
const zusloader = {
  registerZusModule(zusModule: ZusModule) {
    getOrCreateZusLoaderSingleton().registerZusModule(zusModule)
  },
  getRegisteredZusModule(moduleKey: string) {
    return getOrCreateZusLoaderSingleton().getRegisteredZusModule(moduleKey)
  },
  listRegisteredZusModules() {
    return getOrCreateZusLoaderSingleton().listRegisteredZusModules()
  }
}

export default zusloader
