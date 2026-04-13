import type { StoreApi } from 'zustand'
import type {
  MicroAppStatus,
  MicroAppControlActions,
  MicroAppControlState,
} from 'zusloader'

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

export function createMicroAppControlActions(
  store: StoreApi<MicroAppControlState>,
  getHost: GetHostSDK
): MicroAppControlActions {
  const hostNavigate: MicroAppControlActions['hostNavigate'] = (
    nextPath,
    nextParams = {}
  ) => {
    const host = getHost()
    host.navigate(buildPathWithParams(nextPath, nextParams))
  }

  const navigate: MicroAppControlActions['navigate'] = (
    nextPath: string,
    nextParams: Record<string, string> = {}
  ) => {
    const host = getHost()
    const microPath = normalizeMicroPath(nextPath)
    const target = microPath ? `${host.basePath}/${microPath}` : host.basePath
    host.navigate(buildPathWithParams(target, nextParams))
  }

  const setStatus: MicroAppControlActions['setStatus'] = (status: MicroAppStatus) => {
    store.setState({ status })
  }

  const setErrorMsg: MicroAppControlActions['setErrorMsg'] = (message) => {
    store.setState({ errorMsg: message })
  }

  return {
    hostNavigate,
    navigate,
    setStatus,
    setErrorMsg,
  }
}
