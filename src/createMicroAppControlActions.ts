import type { StoreApi } from 'zustand/vanilla'
import type {
  HostSDKBase,
  MicroAppControlExtraState,
  MicroAppStatus,
  MicroAppControlActions,
  MicroAppControlState,
} from '@xuqiyong666/zusloader'

import type { GetHostSDK } from './types'

function normalizeMicroPath(path: string): string {
  if (!path) {
    return ''
  }
  return path.replace(/^\/+/, '')
}

function buildPathWithParams(path: string, params: Record<string, string>): string {
  const search = new URLSearchParams(params)
  const qs = search.toString()
  return qs ? `${path}?${qs}` : path
}

export function createMicroAppControlActions<
  THost extends HostSDKBase,
  TExtraState extends MicroAppControlExtraState = {},
>(
  store: StoreApi<MicroAppControlState<TExtraState>>,
  getHost: GetHostSDK<THost>
): MicroAppControlActions<THost> {
  const readHost: MicroAppControlActions<THost>['getHost'] = () => getHost()

  const hostNavigate: MicroAppControlActions<THost>['hostNavigate'] = (
    nextPath,
    nextParams = {}
  ) => {
    const host = readHost()
    host.navigate(buildPathWithParams(nextPath, nextParams))
  }

  const navigate: MicroAppControlActions<THost>['navigate'] = (
    nextPath: string,
    nextParams: Record<string, string> = {}
  ) => {
    const host = readHost()
    const { basePath } = store.getState()
    const microPath = normalizeMicroPath(nextPath)
    const target = microPath ? `${basePath}/${microPath}` : basePath
    host.navigate(buildPathWithParams(target, nextParams))
  }

  const setStatus: MicroAppControlActions['setStatus'] = (status: MicroAppStatus) => {
    store.setState((s) => ({ ...s, status }))
  }

  const setErrorMsg: MicroAppControlActions['setErrorMsg'] = (message) => {
    store.setState((s) => ({ ...s, errorMsg: message }))
  }

  return {
    getHost: readHost,
    hostNavigate,
    navigate,
    setStatus,
    setErrorMsg,
  }
}
