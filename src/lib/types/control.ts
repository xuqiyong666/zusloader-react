import type { CSSProperties } from 'react';

import type {
  TControlActions as OriginActions,
  TControlSDK as OriginSDK,
  TControlState as OriginState,
} from '@xuqiyong666/zusloader';

export type TThemeMode = 'light' | 'dark';

/** BCP 47 语言标签，文档约定如 `zh-CN`、`en-US` */
export type TAppLanguage = string;

/** React 宿主标准 preference 字段（`control.store` 内为镜像，事实源在宿主侧） */
export interface TPreferenceState {
  themeMode?: TThemeMode;
  timezone?: string;
  language?: TAppLanguage;
}

export interface TPreferenceActions {
  setThemeMode: (themeMode: TThemeMode) => void;
  setTimezone: (timezone: string) => void;
  setLanguage: (language: TAppLanguage) => void;
}

export interface TRootLayoutActions {
  getRootClassName?: () => string | undefined;
  getRootStyle?: () => CSSProperties | undefined;
}

/** 自定义扩展 state */
export interface TExtraState extends Record<string, unknown> { }

/** 自定义扩展 actions */
export interface TExtraActions extends Record<string, unknown> { }

type StandardExtraState<TState extends TExtraState> = TPreferenceState & TState;

type StandardExtraActions<TActions extends TExtraActions> =
  TPreferenceActions & TRootLayoutActions & TActions;

export type TControlState<TState extends TExtraState = TExtraState> = OriginState<
  StandardExtraState<TState>
>;

export type TControlActions<TActions extends TExtraActions = TExtraActions> = OriginActions<
  StandardExtraActions<TActions>
>;

export type TControlSDK<
  TState extends TExtraState = TExtraState,
  TActions extends TExtraActions = TExtraActions,
> = OriginSDK<
  StandardExtraState<TState>,
  StandardExtraActions<TActions>
>;
