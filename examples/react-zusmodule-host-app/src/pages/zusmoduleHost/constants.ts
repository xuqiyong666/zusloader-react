export const PREFIX_PATH = '/zusmodule' as const

export const DEFAULT_MANIFEST_URL = 'http://localhost:3000/dist-zusmodule/manifest.json'

export const MICRO_APP_HOST_DOCK_ICON_SIZE = 48
export const MICRO_APP_HOST_DOCK_EDGE_OFFSET = 16
export const MICRO_APP_HOST_DOCK_DRAG_THRESHOLD = 4
export const MICRO_APP_HOST_DOCK_Y_STORAGE_KEY = 'react-zusmodule-host-app:micro-app-host-dock-y'
export const MICRO_APP_HOST_DOCK_PANEL_WIDTH = 300
export const MICRO_APP_HOST_DOCK_SAFE_TOP = 8
export const MICRO_APP_HOST_DOCK_SAFE_BOTTOM = 8

/** 本地开发态才展示 microAppHost 调试 Dock */
export function isMicroAppHostDevDockEnabled(): boolean {
  return import.meta.env.DEV
}
