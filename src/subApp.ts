export interface SubAppRegistration {
  /** 唯一标识 */
  key: string
  displayName: string
  /** 子应用 manifest 或入口清单 URL */
  manifestUrl?: string
  /** 宿主侧配置路径前缀，仅用于宿主菜单配置与展示 */
  routePrefix?: string
  meta?: Record<string, unknown>
}

export interface SubAppNavigationIntent {
  appKey: string
  path: string
  search?: string
  hash?: string
  payload?: unknown
  replace?: boolean
  /** 递增序号：用于订阅方去重 */
  seq: number
  issuedAt: number
}

export interface SubAppRouteSnapshot {
  appKey: string
  path: string
  search?: string
  hash?: string
  title?: string
  meta?: Record<string, unknown>
  updatedAt: number
}
