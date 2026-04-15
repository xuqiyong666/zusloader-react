import type {
  HostSDKBase,
  MicroAppControlExtraState,
  MicroAppStatus,
  MicroAppControlActions,
  MicroAppMeta,
  MicroAppControlSDK,
  MicroAppControlState,
} from '@xuqiyong666/zusloader'

export type {
  HostSDKBase,
  MicroAppControlExtraState,
  MicroAppStatus,
  MicroAppControlActions,
  MicroAppControlSDK,
  MicroAppControlState,
}

export type {
  NavigateFunction,
  NavigateOptions,
  NavigatePath,
  NavigateTo,
} from './navigateTypes'

export type MicroAppControlContextValue<
  THost extends HostSDKBase = HostSDKBase,
  TExtraState extends MicroAppControlExtraState = {},
> = MicroAppControlSDK<THost, TExtraState>

// HostSDK 直接使用 HostSDKBase（基础包已使用简单参数签名）
export type HostSDK = HostSDKBase

export type GetHostSDK<THost extends HostSDKBase = HostSDKBase> = () => THost

export interface CreateMicroAppControlSDKOptions<
  THost extends HostSDKBase = HostSDKBase,
  TExtraState extends MicroAppControlExtraState = {},
> {
  microApp: MicroAppMeta
  basePath: string
  getHost: GetHostSDK<THost>
  initialState?: TExtraState
}
