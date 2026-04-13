import type { NavigateFunction } from 'react-router-dom'
import type {
  MicroAppStatus,
  MicroAppControlActions,
  MicroAppMeta,
  MicroAppControlSDK,
  MicroAppControlState,
} from 'zusloader'

export type {
  MicroAppStatus,
  MicroAppControlActions,
  MicroAppControlSDK,
  MicroAppControlState,
}

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
