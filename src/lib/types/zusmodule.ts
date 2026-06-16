import type { TAppMeta } from 'zusloader';

import type { TErrorWithCause } from './error';
import type { TReactZusModule } from './react-zusmodule';

export interface TUseZusModuleOptions {
  zusmodule_manifest_url: string;
}

export interface TUseZusModuleResult {
  isLoading: boolean;
  zusmodule: TReactZusModule | null;
  error: TErrorWithCause | null;
}

export interface TUseZusModuleAndMicroAppOptions extends TUseZusModuleOptions {
  /** 微应用 appKey */
  microAppKey: string;
}

export interface TUseZusModuleAndMicroAppResult {
  isLoading: boolean;
  zusmodule: TReactZusModule | null;
  microApp: TAppMeta | null;
  error: TErrorWithCause | null;
}
