import { useMemo } from 'react';
import { createStore } from 'zustand/vanilla';
import type { MicroAppControlSDK, MicroAppControlState, MicroAppMeta, ZusModule } from '@xuqiyong666/zusloader';
import { createControlForMicroApp, type MicroAppHostStateRef } from '../createControlForMicroApp';
import { useNavigateForMicroApp } from './useNavigateForMicroApp';
import { useStateRef } from './useStateRef';

export interface UseControlForMicroAppOptions {
  microApp: MicroAppMeta;
  zusmodule: ZusModule;
  basePath: string;
  pagePath?: string;
}

export function useControlForMicroApp({
  microApp,
  zusmodule,
  basePath,
  pagePath,
}: UseControlForMicroAppOptions): {
  control: MicroAppControlSDK<{ embed: boolean }>;
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
      createStore<MicroAppControlState<{ embed: boolean }>>(() => ({
        router: {
          path: microApp.indexPagePath,
          params: {},
        },
        basePath,
        status: 'idle' as const,
        errorMsg: undefined,
        embed: true,
      })),
    [microApp.appKey, microApp.indexPagePath, zusmodule.moduleKey, basePath]
  );

  const actions = useMemo(() =>
    createControlForMicroApp({ store, stateRef }),
    [store, stateRef]
  );

  const control = useMemo(() => (
    { store, actions }
  ), [store, actions]
  );

  return { control, stateRef };
}
