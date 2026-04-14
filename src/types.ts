import type {
  MicroAppStatus,
  MicroAppControlActions,
  MicroAppMeta,
  MicroAppControlSDK,
  MicroAppControlState,
} from '@xuqiyong666/zusloader'

import type { NavigateFunction } from './navigateTypes'

export type {
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

export type MicroAppControlContextValue = MicroAppControlSDK

export interface HostSDK {
  navigate: NavigateFunction
  basePath: string
}

export type GetHostSDK = () => HostSDK

export interface CreateMicroAppControlSDKOptions {
  microApp: MicroAppMeta
  getHost: GetHostSDK
}
