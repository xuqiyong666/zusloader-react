import type { StoreApi } from 'zustand/vanilla';
import type { THostSDKBase, TStatus } from 'zusloader-react';
import type { TReactControlActions, TReactControlSDK, TReactControlState } from 'zusloader-react';

import { resolveAppLanguage, type AppLanguage } from '../../utils/locale.ts';

const rootStyle = {
  width: '100%',
  height: '100%',
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
} as const;

export function createDevMicroAppControl(options: {
  store: StoreApi<TReactControlState>;
  navigate: THostSDKBase['navigate'];
  basePath: string;
}): TReactControlSDK {
  const { store, navigate, basePath } = options;

  const hostNavigate: TReactControlActions['hostNavigate'] = (
    nextPath,
    nextParams = {},
    replace,
  ) => {
    navigate(nextPath, nextParams, replace);
  };

  const navigateInApp: TReactControlActions['navigate'] = (
    nextPath,
    nextParams = {},
    replace,
  ) => {
    const normalizedPath = nextPath.startsWith('/') ? nextPath : `/${nextPath}`;
    navigate(`${basePath}${normalizedPath}`, nextParams, replace);
  };

  const setStatus = (status: TStatus) => {
    store.setState((state) => ({ ...state, status }));
  };

  const setErrorMsg = (message: string | undefined) => {
    store.setState((state) => ({ ...state, errorMsg: message }));
  };

  const setThemeMode: TReactControlActions['setThemeMode'] = (themeMode) => {
    store.setState({ themeMode });
  };

  const setTimezone: TReactControlActions['setTimezone'] = (timezone) => {
    store.setState({ timezone });
  };

  const setLanguage: TReactControlActions['setLanguage'] = (language: AppLanguage) => {
    store.setState({ language: resolveAppLanguage(language) });
  };

  return {
    store,
    actions: {
      hostNavigate,
      navigate: navigateInApp,
      setStatus,
      setErrorMsg,
      setThemeMode,
      setTimezone,
      setLanguage,
      getRootClassName: () => undefined,
      getRootStyle: () => rootStyle,
    },
  };
}
