export interface HostNavigationTarget {
  pathname: string
  search?: string
  hash?: string
  state?: unknown
  replace?: boolean
}

/**
 * 由宿主实现：将门面层的导航请求映射到实际路由系统（React Router、Vue Router 等）。
 */
export interface HostRouterAdapter {
  navigate: (target: HostNavigationTarget) => void | Promise<void>
}
