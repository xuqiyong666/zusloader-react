import type { CSSProperties } from 'vue'
import type { StoreApi } from 'zustand/vanilla'
import type { TControlActions, TControlState } from 'zusloader'

import type { AppLanguage } from '../microAppControl'

/** 与 React 宿主 example 对齐的 preference 字段（运行时子模块会读取） */
export type TVueControlPreferenceState = {
  themeMode?: 'light' | 'dark'
  timezone?: string
  language?: AppLanguage
}

export type TVueControlState = TControlState & TVueControlPreferenceState

export type TVueControlActions = TControlActions & {
  setThemeMode: (themeMode: 'light' | 'dark') => void
  setTimezone: (timezone: string) => void
  setLanguage: (language: AppLanguage) => void
  getRootClassName: () => string | undefined
  getRootStyle: () => CSSProperties | undefined
}

export type TVueControlSDK = {
  store: StoreApi<TVueControlState>
  actions: TVueControlActions
}
