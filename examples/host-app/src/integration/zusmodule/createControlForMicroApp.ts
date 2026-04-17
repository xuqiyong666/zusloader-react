import type { MutableRefObject } from 'react';
import type { StoreApi } from 'zustand/vanilla';
import type {
  HostSDKBase,
  MicroAppControlActions,
  MicroAppControlState,
  MicroAppMeta,
} from '@xuqiyong666/zusloader';

/** 每帧由 useStateRef 更新；actions 调用时读取最新宿主上下文 */
export type MicroAppHostStateRef = {
  navigate: HostSDKBase['navigate'];
  basePath: string;
  pagePath?: string;
  microApp: MicroAppMeta;
};

export function createControlForMicroApp<TExtra extends Record<string, unknown>>(options: {
  store: StoreApi<MicroAppControlState<TExtra>>;
  stateRef: MutableRefObject<MicroAppHostStateRef>;
}): MicroAppControlActions {
  const { store, stateRef } = options;

  return {
    hostNavigate(nextPath, nextParams, replace) {
      stateRef.current.navigate(nextPath, nextParams, replace);
    },
    navigate(nextPath, nextParams = {}, replace) {
      const { navigate, basePath } = stateRef.current;
      const normalizedPath = nextPath.startsWith('/') ? nextPath : `/${nextPath}`;
      navigate(`${basePath}${normalizedPath}`, nextParams, replace);
    },
    setStatus(status) {
      store.setState((s) => ({ ...s, status }));
    },
    setErrorMsg(message) {
      store.setState((s) => ({ ...s, errorMsg: message }));
    },
  };
}
