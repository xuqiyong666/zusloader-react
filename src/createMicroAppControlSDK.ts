import type {
  HostSDKBase,
  MicroAppControlExtraState,
  MicroAppControlSDK,
} from '@xuqiyong666/zusloader'

import { createMicroAppControlActions } from './createMicroAppControlActions'
import { createMicroAppControlStore } from './createMicroAppControlStore'
import type { CreateMicroAppControlSDKOptions } from './types'

export function createMicroAppControlSDK<
  THost extends HostSDKBase,
  TExtraState extends MicroAppControlExtraState = {},
>(
  options: CreateMicroAppControlSDKOptions<THost, TExtraState>
): MicroAppControlSDK<THost, TExtraState> {
  const { microApp, basePath, getHost, initialState } = options
  const store = createMicroAppControlStore({
    path: microApp.indexPagePath,
    params: {},
    basePath,
    initialState,
  })
  const actions = createMicroAppControlActions(store, getHost)
  return { store, actions }
}
