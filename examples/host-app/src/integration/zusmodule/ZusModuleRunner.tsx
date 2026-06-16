import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react';
import type { TAppMeta, TReactZusModule } from 'zusloader-react';
import { urlToRouterPayload } from './utils/router';
import { useControlForMicroApp } from './hooks/useControlForMicroApp';
import { useSyncMicroAppRouterFromSearchParams } from './hooks/useSyncMicroAppRouterFromSearchParams';

export interface ZusModuleRunnerProps {
  zusmodule: TReactZusModule;
  microApp: TAppMeta;
  basePath: string;
  pagePath?: string;
  rootDomRef: RefObject<HTMLDivElement | null>;
}

/** URL 为唯一事实源：path/search 单向同步到 control.store。 */
export default function ZusModuleRunner(props: ZusModuleRunnerProps) {

  const {
    zusmodule,
    microApp,
    basePath,
    pagePath,
    rootDomRef,
  } = props

  const unmountRef = useRef<(() => void) | null>(null);

  const { control } = useControlForMicroApp({ microApp, zusmodule, basePath, pagePath });

  const searchParamsRef = useSyncMicroAppRouterFromSearchParams({
    control,
    microApp,
    pagePath,
  });

  useLayoutEffect(() => {
    unmountRef.current?.();
    unmountRef.current = null;

    const el = rootDomRef.current;
    if (!el) {
      return;
    }

    const sp = new URLSearchParams(searchParamsRef.current.toString());
    const { path, params } = urlToRouterPayload(pagePath, sp, microApp.indexPagePath);
    control.store.setState({ router: { path, params } });
  
    const { unmount } = zusmodule.mountMicroApp({
      mountElement: el,
      microApp,
      control,
    });
    unmountRef.current = unmount;

  }, [zusmodule, microApp]);

  useEffect(() => {
    return () => {
      unmountRef.current?.();
      unmountRef.current = null;
    };
  }, []);

  return null;
}
