import type { StoreApi } from 'zustand'

import type {
  SubAppNavigationIntent,
  SubAppRegistration,
  SubAppRouteSnapshot,
} from './subApp'
import type { SingleAppShareLibs } from './shareLibs'

/**
 * 挂载到 `window[globalKey]` 的门面形状。
 * 宿主通过 `initSingleAppHost` 创建；子应用由 `single-app-client` 等封装访问。
 */
export interface SingleAppHostFacade<TState> {
  version: string
  apiVersion: string
  shareLibs: SingleAppShareLibs
  /** 宿主提供的 Zustand store，子应用通过 `subscribe` / `getState` 消费 */
  globalStore: StoreApi<TState>
  registerSubApps: (apps: SubAppRegistration[]) => void
  unregisterSubApp: (key: string) => void
  getSubApp: (key: string) => SubAppRegistration | undefined
  listSubApps: () => readonly SubAppRegistration[]
  publishNavigationIntent: (options: {
    appKey: string
    path: string
    search?: string
    hash?: string
    payload?: unknown
    replace?: boolean
  }) => SubAppNavigationIntent | undefined
  getLatestNavigationIntent: (appKey: string) => SubAppNavigationIntent | undefined
  subscribeNavigationIntent: (
    appKey: string,
    listener: (intent: SubAppNavigationIntent) => void
  ) => () => void
  updateSubAppRoute: (route: Omit<SubAppRouteSnapshot, 'updatedAt'>) => void
  getSubAppRoute: (appKey: string) => SubAppRouteSnapshot | undefined
  subscribeSubAppRoute: (
    appKey: string,
    listener: (route: SubAppRouteSnapshot) => void
  ) => () => void
}
