import type { StoreApi } from 'zustand'

/** 微应用入口（如 lazy chunk）与 manifest 对齐相关的状态 */
export type MicroAppStatus = 'idle' | 'loading' | 'ready' | 'error'

/** MicroApp 路由 store 中仅存的数据（不含 actions） */
export interface MicroAppRouter {
  path: string
  params?: Record<string, string>
}

export interface MicroAppControlState {
  router: MicroAppRouter;
  status: MicroAppStatus
  errorMsg?: string
}

/** 微应用内页面元信息 */
export interface MicroAppPageMeta {
  path: string
  /** 侧栏展示名，缺省为 key */
  title: string
}

/** 微应用元信息（宿主 / 子模块 manifest 对齐用） */
export interface MicroAppMeta {
  appKey: string
  displayName: string
  /** 未指定页面时的默认页，必须为 `pageList` 中某项的 `key` */
  indexPagePath: string
  pageList: MicroAppPageMeta[]
}

/** 由宿主（或本地开发壳）实现并注入；引用在注入后应保持稳定 */
export interface MicroAppControlActions {
  hostNavigate: (path: string, params?: Record<string, string>) => void
  navigate: (path: string, params?: Record<string, string>) => void
  setStatus: (status: MicroAppStatus) => void
  /** 传入 `undefined` 表示清除文案 */
  setErrorMsg: (message: string | undefined) => void
}

/** 宿主注入：zustand store + 路由方法（简写 `store` / `actions`） */
export interface MicroAppControlSDK {
  store: StoreApi<MicroAppControlState>
  actions: MicroAppControlActions
}

export interface MountMicroAppOptions {
  mountElement: HTMLElement
  microApp: MicroAppMeta
  control: MicroAppControlSDK
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
