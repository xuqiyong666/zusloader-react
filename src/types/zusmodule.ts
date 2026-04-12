import type { StoreApi } from 'zustand'

/** 微应用入口（如 lazy chunk）与 manifest 对齐相关的状态 */
export type MicroAppStatus = 'idle' | 'loading' | 'ready' | 'error'

/** MicroApp 路由 store 中仅存的数据（不含 actions） */
export interface MicroAppRouterState {
  pageKey?: string
  pageParams?: Record<string, string>
  /** 入口加载、就绪等；宿主可不使用，保持 idle 即可 */
  status: MicroAppStatus
  /**
   * 通用文案通道：宿主可优先根据是否有内容决定错误/提示 UI；
   * 可用于入口配置、chunk 失败、微应用运行期上报等，不与 `status` 强绑定。
   */
  errorMsg?: string
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

/** 由宿主（或本地开发壳）实现并注入；引用在注入后应保持稳定 */
export interface MicroAppRouterActions {
  getAllowedPageKeys: () => ReadonlySet<string>
  go: (pageKey: string, pageParams?: Record<string, string>) => void
  setPageParams: (pageParams: Record<string, string>) => void
  resetToIndex: () => void
  setStatus: (status: MicroAppStatus) => void
  /** 传入 `undefined` 表示清除文案 */
  setErrorMsg: (message: string | undefined) => void
}

/** 宿主注入：zustand store + 路由方法（简写 `store` / `actions`） */
export interface MicroAppRouter {
  store: StoreApi<MicroAppRouterState>
  actions: MicroAppRouterActions
}

export interface MountMicroAppOptions {
  mountElement: HTMLElement
  microApp: MicroAppMeta
  router: MicroAppRouter
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
