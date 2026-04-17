import { useEffect, useRef, type MutableRefObject } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { MicroAppControlSDK, MicroAppMeta } from '@xuqiyong666/zusloader';
import { shallowEqual, urlToRouterPayload } from '../utils/router';

export interface UseSyncMicroAppRouterFromSearchParamsOptions {
  control: MicroAppControlSDK;
  microApp: MicroAppMeta;
  pagePath?: string;
}

/**
 * 须在 react-router `<Router>` 子树内使用。
 * 返回的 ref 与当前 URL 查询同步，供 `useLayoutEffect` 首帧读取。
 */
export function useSyncMicroAppRouterFromSearchParams({
  control,
  microApp,
  pagePath,
}: UseSyncMicroAppRouterFromSearchParamsOptions): MutableRefObject<URLSearchParams> {
  const [searchParams] = useSearchParams();
  const searchParamsRef = useRef(searchParams);
  searchParamsRef.current = searchParams;

  useEffect(() => {
    const sp = new URLSearchParams(searchParams.toString());
    const { path, params } = urlToRouterPayload(pagePath, sp, microApp.indexPagePath);
    const cur = control.store.getState();
    const curParams = cur.router.params ?? {};
    if (cur.router.path === path && shallowEqual(curParams, params)) {
      return;
    }

    control.store.setState({ router: { path, params } });
  }, [control, microApp.appKey, microApp.indexPagePath, pagePath, searchParams]);

  return searchParamsRef;
}
