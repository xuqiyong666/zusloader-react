import type { StoreApi } from 'zustand/vanilla'
import type {
  HostSDKBase,
  MicroAppControlExtraState,
  MicroAppStatus,
  MicroAppControlActions,
  MicroAppControlState,
} from '@xuqiyong666/zusloader'

import type { GetHostSDK } from './types'

export function createMicroAppControlActions<
  THost extends HostSDKBase,
  TExtraState extends MicroAppControlExtraState = {},
>(
  store: StoreApi<MicroAppControlState<TExtraState>>,
  getHost: GetHostSDK<THost>
): MicroAppControlActions<THost> {

  const hostNavigate: MicroAppControlActions<THost>['hostNavigate'] = (
    nextPath,
    nextParams = {}
  ) => {
    const host = getHost()
    host.navigate(nextPath, nextParams)
  }

  const navigate: MicroAppControlActions<THost>['navigate'] = (
    nextPath: string,
    nextParams: Record<string, string> = {}
  ) => {

    if (nextPath[0] !== '/') {
      nextPath = '/' + nextPath
    }

    const host = getHost()
    const { basePath } = store.getState()
    const fullPath = `${basePath}${nextPath}`
    host.navigate(fullPath, nextParams)
  }

  const setStatus: MicroAppControlActions['setStatus'] = (status: MicroAppStatus) => {
    store.setState((s) => ({ ...s, status }))
  }

  const setErrorMsg: MicroAppControlActions['setErrorMsg'] = (message) => {
    store.setState((s) => ({ ...s, errorMsg: message }))
  }

  return {
    getHost,
    hostNavigate,
    navigate,
    setStatus,
    setErrorMsg,
  }
}
