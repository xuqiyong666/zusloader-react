import type { StoreApi } from 'zustand'
import { createStore } from 'zustand/vanilla'

import { SINGLE_APP_HOST_DEFAULT_GLOBAL_KEY } from './constants'
import type { SingleAppHostFacade } from './facade'
import type { SingleAppShareLibs } from './shareLibs'
import type {
  SubAppNavigationIntent,
  SubAppRegistration,
  SubAppRouteSnapshot,
} from './subApp'

export type DuplicateInitBehavior = 'throw' | 'ignore' | 'replace'

export interface InitSingleAppHostOptions<TState> {
  /**
   * `window` 上的属性名，默认 `__SingleAppHost__`。
   */
  globalKey?: string
  store: StoreApi<TState>
  shareLibs?: SingleAppShareLibs
  /** 宿主产品版本等 */
  version?: string
  /** 与本包类型契约对齐的版本号 */
  apiVersion?: string
  /**
   * 当 `window[globalKey]` 已存在时的行为。
   * - `throw`：抛错（默认）
   * - `ignore`：返回已有实例，不修改
   * - `replace`：覆盖为新实例
   */
  onDuplicateInit?: DuplicateInitBehavior
}

interface SingleAppHostSignalState {
  navIntents: Record<string, SubAppNavigationIntent | undefined>
  routes: Record<string, SubAppRouteSnapshot | undefined>
}

function getBrowserWindow(): Window | undefined {
  if (typeof window === 'undefined') {
    return undefined
  }
  return window
}

/**
 * 在浏览器中将门面挂载到 `window[globalKey]`。
 * 不会自动执行：须由宿主在应用启动时调用。
 */
export function initSingleAppHost<TState>(
  options: InitSingleAppHostOptions<TState>
): SingleAppHostFacade<TState> {
  const win = getBrowserWindow()
  if (!win) {
    throw new Error(
      'initSingleAppHost: no browser `window` (must run in a client environment).'
    )
  }

  const globalKey =
    options.globalKey?.trim() || SINGLE_APP_HOST_DEFAULT_GLOBAL_KEY
  const duplicate = options.onDuplicateInit ?? 'throw'
  const carrier = win as Window & Record<string, unknown>
  const existing = carrier[globalKey] as SingleAppHostFacade<TState> | undefined

  if (existing) {
    if (duplicate === 'ignore') {
      return existing
    }
    if (duplicate === 'throw') {
      throw new Error(
        `initSingleAppHost: window['${globalKey}'] already exists. Pass onDuplicateInit: 'replace' or 'ignore' to override.`
      )
    }
  }

  const registry = new Map<string, SubAppRegistration>()
  const shareLibs: SingleAppShareLibs = options.shareLibs
    ? { ...options.shareLibs }
    : {}
  const routeSignalStore = createStore<SingleAppHostSignalState>(() => ({
    navIntents: {},
    routes: {},
  }))
  let navSeq = 0

  const facade: SingleAppHostFacade<TState> = {
    version: options.version ?? '0.0.0',
    apiVersion: options.apiVersion ?? '0.1.0',
    shareLibs,
    globalStore: options.store,
    registerSubApps(apps) {
      for (const app of apps) {
        registry.set(app.key, app)
      }
    },
    unregisterSubApp(key) {
      registry.delete(key)
    },
    getSubApp(key) {
      return registry.get(key)
    },
    listSubApps() {
      return Object.freeze([...registry.values()])
    },
    publishNavigationIntent(optionsInput) {
      const reg = registry.get(optionsInput.appKey)
      if (!reg) {
        console.warn(
          `[SingleAppHost] publishNavigationIntent: app not registered: ${optionsInput.appKey}`
        )
        return undefined
      }
      const intent: SubAppNavigationIntent = {
        appKey: reg.key,
        path: optionsInput.path,
        search: optionsInput.search,
        hash: optionsInput.hash,
        payload: optionsInput.payload,
        replace: optionsInput.replace,
        seq: ++navSeq,
        issuedAt: Date.now(),
      }
      routeSignalStore.setState((prev) => ({
        ...prev,
        navIntents: {
          ...prev.navIntents,
          [reg.key]: intent,
        },
      }))
      return intent
    },
    getLatestNavigationIntent(appKey) {
      return routeSignalStore.getState().navIntents[appKey]
    },
    subscribeNavigationIntent(appKey, listener) {
      let prev = routeSignalStore.getState().navIntents[appKey]
      return routeSignalStore.subscribe((state) => {
        const next = state.navIntents[appKey]
        if (!next || next.seq === prev?.seq) {
          return
        }
        prev = next
        listener(next)
      })
    },
    updateSubAppRoute(route) {
      const reg = registry.get(route.appKey)
      if (!reg) {
        console.warn(
          `[SingleAppHost] updateSubAppRoute: app not registered: ${route.appKey}`
        )
        return
      }
      const snapshot: SubAppRouteSnapshot = {
        ...route,
        updatedAt: Date.now(),
      }
      routeSignalStore.setState((prev) => ({
        ...prev,
        routes: {
          ...prev.routes,
          [route.appKey]: snapshot,
        },
      }))
    },
    getSubAppRoute(appKey) {
      return routeSignalStore.getState().routes[appKey]
    },
    subscribeSubAppRoute(appKey, listener) {
      let prev = routeSignalStore.getState().routes[appKey]
      return routeSignalStore.subscribe((state) => {
        const next = state.routes[appKey]
        if (!next || next.updatedAt === prev?.updatedAt) {
          return
        }
        prev = next
        listener(next)
      })
    },
  }

  carrier[globalKey] = facade
  return facade
}

/**
 * 读取已挂载的门面（若未初始化则 `undefined`）。
 */
export function getSingleAppHost<TState = unknown>(
  globalKey: string = SINGLE_APP_HOST_DEFAULT_GLOBAL_KEY
): SingleAppHostFacade<TState> | undefined {
  const win = getBrowserWindow()
  if (!win) {
    return undefined
  }
  const carrier = win as Window & Record<string, unknown>
  return carrier[globalKey] as SingleAppHostFacade<TState> | undefined
}

/**
 * 从 `window` 上移除门面（测试或销毁宿主时使用）。
 */
export function destroySingleAppHost(
  globalKey: string = SINGLE_APP_HOST_DEFAULT_GLOBAL_KEY
): void {
  const win = getBrowserWindow()
  if (!win) {
    return
  }
  const carrier = win as Window & Record<string, unknown>
  delete carrier[globalKey]
}
