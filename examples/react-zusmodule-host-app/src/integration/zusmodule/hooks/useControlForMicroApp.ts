import { useMemo } from 'react';
import { createStore } from 'zustand/vanilla';
import type { TAppMeta, TReactControlSDK, TReactControlState, TReactZusModule } from 'zusloader-react';
import { createControlForMicroApp, type MicroAppHostStateRef } from '../createControlForMicroApp';
import { DEFAULT_APP_LANGUAGE } from '../microAppControl';
import { useNavigateForMicroApp } from './useNavigateForMicroApp';
import { useStateRef } from './useStateRef';

export interface UseControlForMicroAppOptions {
  microApp: TAppMeta;
  zusmodule: TReactZusModule;
  basePath: string;
  pagePath?: string;
}

export function useControlForMicroApp({
  microApp,
  zusmodule,
  basePath,
  pagePath,
}: UseControlForMicroAppOptions): {
  control: TReactControlSDK;
  stateRef: ReturnType<typeof useStateRef<MicroAppHostStateRef>>;
} {
  const navigate = useNavigateForMicroApp();
  const stateRef = useStateRef<MicroAppHostStateRef>(() => ({
    navigate,
    basePath,
    pagePath,
    microApp,
  }));

  const store = useMemo(
    () =>
      createStore<TReactControlState>(() => ({
        router: {
          path: microApp.indexPagePath,
          params: {},
        },
        basePath,
        status: 'idle' as const,
        errorMsg: undefined,
        themeMode: 'light',
        timezone: 'Asia/Shanghai',
        language: DEFAULT_APP_LANGUAGE,
      })),
    [microApp.appKey, microApp.indexPagePath, zusmodule.moduleKey, basePath]
  );

  const actions = useMemo(
    () => createControlForMicroApp({ store, stateRef }),
    [store, stateRef],
  );

  const control = useMemo<TReactControlSDK>(
    () => ({ store, actions }),
    [store, actions],
  );

  return { control, stateRef };
}
