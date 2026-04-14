import type {
  HostSDKBase,
  MicroAppControlExtraState,
  MicroAppStatus,
  MicroAppControlActions,
  MicroAppMeta,
  MicroAppControlSDK,
  MicroAppControlState,
} from '@xuqiyong666/zusloader'

import type { NavigateFunction } from './navigateTypes'

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
  THost extends HostSDKBase = HostSDK,
  TExtraState extends MicroAppControlExtraState = {},
> = MicroAppControlSDK<THost, TExtraState>

export interface HostSDK extends Omit<HostSDKBase, 'navigate'> {
  navigate: NavigateFunction
}

export type GetHostSDK<THost extends HostSDKBase = HostSDK> = () => THost

export interface CreateMicroAppControlSDKOptions<
  THost extends HostSDKBase = HostSDK,
  TExtraState extends MicroAppControlExtraState = {},
> {
  microApp: MicroAppMeta
  basePath: string
  getHost: GetHostSDK<THost>
  initialState?: TExtraState
}
