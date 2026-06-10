import { useMemo } from 'react';
import { createStore } from 'zustand/vanilla';
import type { TAppMeta, TZusModule } from '@xuqiyong666/zusloader';
import type { TControlSDK, TControlState, TExtraState } from '@xuqiyong666/zusloader-react';
import { createControlForMicroApp, type MicroAppHostStateRef } from '../createControlForMicroApp';
import { DEFAULT_APP_LANGUAGE } from '../microAppControl';
import { useNavigateForMicroApp } from './useNavigateForMicroApp';
import { useStateRef } from './useStateRef';

export interface UseControlForMicroAppOptions {
  microApp: TAppMeta;
  zusmodule: TZusModule;
  basePath: string;
  pagePath?: string;
}

export function useControlForMicroApp({
  microApp,
  zusmodule,
  basePath,
  pagePath,
}: UseControlForMicroAppOptions): {
  control: TControlSDK;
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
      createStore<TControlState<TExtraState>>(() => ({
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

  const control = useMemo<TControlSDK>(
    () => ({ store, actions }),
    [store, actions],
  );

  return { control, stateRef };
}
