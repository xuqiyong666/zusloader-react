/**
 * 子应用在主应用侧的登记信息，用于发现、菜单与跨应用跳转。
 */

export interface SubAppRegistration {
  /** 唯一标识，跳转与配置中引用 */
  key: string
  displayName: string
  /** 子应用 manifest（或入口清单）URL，可与主应用同源相对路径 */
  manifestUrl: string
  /** 主应用内路由前缀，如 `/apps/demo` */
  routePrefix?: string
  meta?: Record<string, unknown>
}

/** 跨子应用跳转入参；目标不存在时由主应用中止并输出控制台提示 */
export interface NavigateToSubAppOptions {
  appKey: string
  /** 子应用内部路径，格式由子应用与主应用约定 */
  path?: string
  search?: string
  hash?: string
  state?: unknown
}
