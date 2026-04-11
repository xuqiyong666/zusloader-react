import type { StoreApi } from 'zustand'

/** MicroApp 路由 store 中仅存的数据（不含 actions） */
export interface MicroAppRouterState {
  pageKey: string
  pageParams: Record<string, string>
}

/** 微应用内页面元信息 */
export interface MicroAppPageMeta {
  key: string
  /** 侧栏展示名，缺省为 key */
  name?: string
}

/** 微应用元信息（宿主 / 子模块 manifest 对齐用） */
export interface MicroAppMeta {
  appKey: string
  displayName: string
  /** 未指定页面时的默认页，必须为 `pageList` 中某项的 `key` */
  indexPageId: string
  pageList: MicroAppPageMeta[]
}

export interface MountMicroAppOptions {
  mountElement: HTMLElement
  microApp: MicroAppMeta
  routerStore: StoreApi<MicroAppRouterState>
}

export interface MountMicroAppResult {
  unmount: () => void
}

/** 子模块构建入口登记到 zusloader 的描述对象 */
export interface ZusModule {
  moduleKey: string
  displayName: string
  microApps: MicroAppMeta[]
  mountMicroApp: (options: MountMicroAppOptions) => MountMicroAppResult
}

/** 挂在 `window[globalKey]` 上的 API（与 manifest 中 `ZUS_LOADER_GLOBAL_KEY` 一致） */
export interface ZusLoaderApi {
  /** 已注册子模块，键为 `moduleKey` */
  modules: Record<string, ZusModule>
  registerZusModule: (zusModule: ZusModule) => void
  getRegisteredZusModule: (moduleKey: string) => ZusModule | undefined
  listRegisteredZusModules: () => ZusModule[]
}
