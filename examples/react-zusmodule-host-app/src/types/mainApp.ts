import type { MainAppGlobalState, MainAppStoreApi } from './globalState.ts'
import type { MainAppShareLibs } from './shareLibs.ts'
import type { NavigateToSubAppOptions, SubAppRegistration } from './subAppRegistry.ts'

/**
 * TypeScript 层面的契约版本；与运行时 `MainAppGlobal.version` 对齐，供子应用做兼容判断。
 * 破坏性变更时递增。
 */
export const MAIN_APP_API_VERSION = '0.1.0' as const

export type MainAppApiVersion = typeof MAIN_APP_API_VERSION

/**
 * 主应用挂载到 `window.__MainApp__` 的门面类型。
 * 实现类由主应用在启动时赋值；子应用仅消费该契约。
 */
export interface MainAppGlobal {
  /** 契约版本（建议使用 semver 字符串） */
  version: string
  apiVersion: MainAppApiVersion

  shareLibs: MainAppShareLibs

  /** 批量注册或更新子应用元数据（合并策略由实现决定） */
  registerSubApps: (apps: SubAppRegistration[]) => void
  unregisterSubApp: (key: string) => void
  getSubApp: (key: string) => SubAppRegistration | undefined
  listSubApps: () => readonly SubAppRegistration[]

  /**
   * 跳转到指定子应用视图；目标不存在时返回 false 并在 console 提示。
   * @returns 是否已接受本次跳转（不代表子应用已加载完成）
   */
  navigateToSubApp: (options: NavigateToSubAppOptions) => boolean

  globalStore: MainAppStoreApi<MainAppGlobalState>
}

declare global {
  interface Window {
    __MainApp__?: MainAppGlobal
  }
}

export {}
