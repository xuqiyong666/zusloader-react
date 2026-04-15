/**
 * 兼容 react-router 的 NavigateFunction（历史保留，不推荐新代码使用）
 * 避免本包对 `react-router-dom` 的运行时/类型依赖。
 * 参考：react-router@7 `NavigateFunction`、`To`、`NavigateOptions`。
 */

/** `To`：字符串路径或部分 Path */
export type NavigateTo = string | Partial<NavigatePath>

export interface NavigatePath {
  pathname?: string
  search?: string
  hash?: string
}

export interface NavigateOptions {
  replace?: boolean
  unstable_mask?: NavigateTo
  state?: unknown
  preventScrollReset?: boolean
  relative?: 'route' | 'path'
  flushSync?: boolean
  viewTransition?: boolean
  unstable_defaultShouldRevalidate?: boolean
}

export interface NavigateFunction {
  (to: NavigateTo, options?: NavigateOptions): void | Promise<void>
  (delta: number): void | Promise<void>
}
