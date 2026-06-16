import { useEffect, useState } from 'react';

import { loadModule } from 'zusloader';

import { TErrorWithCause, toError } from './errors';
import type { TReactZusModule } from './types/react-zusmodule';
import type { TUseZusModuleOptions, TUseZusModuleResult } from './types/zusmodule';

/** 按 manifest URL 拉取并执行 zus-module，从 zusloader 取已注册模块。 */
export function useZusModule(options: TUseZusModuleOptions): TUseZusModuleResult {
  const { zusmodule_manifest_url } = options;

  const [isLoading, setIsLoading] = useState(true);
  const [zusmodule, setZusmodule] = useState<TReactZusModule | null>(null);
  const [error, setError] = useState<TUseZusModuleResult['error']>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    setZusmodule(null);

    const manifestUrl = zusmodule_manifest_url;

    void (async () => {
      try {
        const registered = await loadModule(manifestUrl);
        setZusmodule(registered);
        setIsLoading(false);
      } catch (e) {
        setZusmodule(null);
        setError(new TErrorWithCause('ZusModule 加载失败', toError(e)));
        setIsLoading(false);
      }
    })();
  }, [zusmodule_manifest_url]);

  return { isLoading, zusmodule, error };
}
