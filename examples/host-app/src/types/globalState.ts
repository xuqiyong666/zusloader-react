/**
 * 主应用通过 Zustand 等实现的共享状态，子应用仅依赖本文件中的形状。
 * 实际 store 由主应用创建并挂到 `MainAppGlobal.globalStore`。
 */

/** 登录用户摘要，可按业务扩展字段 */
export interface MainAppUser {
  userId: string
  displayName?: string
  username?: string
  roles?: string[]
}

/** 全局 store 中的 state 形状（随迭代可增加字段） */
export interface MainAppGlobalState {
  user: MainAppUser | null
}

/**
 * 与 Zustand `StoreApi<T>` 兼容的最小订阅接口，避免类型文件依赖 zustand 包。
 * 主应用传入 `createStore` / `create` 返回值即可。
 */
export interface MainAppStoreApi<T> {
  getState: () => T
  subscribe: (listener: (state: T, prevState: T) => void) => () => void
}
