import type { MicroAppControlSDK } from 'zusloader'

import { createMicroAppControlActions } from './createMicroAppControlActions'
import { createMicroAppControlStore } from './createMicroAppControlStore'
import type { CreateMicroAppControlSDKOptions } from './types'

export function createMicroAppControlSDK(
  options: CreateMicroAppControlSDKOptions
): MicroAppControlSDK {
  const { microApp, getHost } = options
  const store = createMicroAppControlStore({
    path: microApp.indexPagePath,
    params: {},
  })
  const actions = createMicroAppControlActions(store, getHost)
  return { store, actions }
}
