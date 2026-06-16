import type { CSSProperties } from 'react';

export type TThemeMode = 'light' | 'dark';

/** BCP 47 语言标签，文档约定如 `zh-CN`、`en-US` */
export type TAppLanguage = string;

/** React 宿主标准 preference 字段（`control.store` 内为镜像，事实源在宿主侧） */
export interface TPreferenceState {
  themeMode?: TThemeMode;
  timezone?: string;
  language?: TAppLanguage;
}

/**
 * React 宿主可选 preference 能力。
 * 方法为 optional，以兼容仅实现基础四方法的 control；调用方请使用 `?.`。
 */
export interface TPreferenceActions {
  setThemeMode?: (themeMode: TThemeMode) => void;
  setTimezone?: (timezone: string) => void;
  setLanguage?: (language: TAppLanguage) => void;
}

export interface TRootLayoutActions {
  getRootClassName?: () => string | undefined;
  getRootStyle?: () => CSSProperties | undefined;
}

/** 自定义扩展 state */
export interface TExtraState extends Record<string, unknown> {}

/** 自定义扩展 actions */
export interface TExtraActions extends Record<string, unknown> {}
