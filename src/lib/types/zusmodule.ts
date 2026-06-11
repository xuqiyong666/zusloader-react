import type { TAppMeta, TZusModule } from '@xuqiyong666/zusloader';

import type { TErrorWithCause } from './error';

export interface TUseZusModuleOptions {
  zusmodule_manifest_url: string;
}

export interface TUseZusModuleResult {
  isLoading: boolean;
  zusmodule: TZusModule | null;
  error: TErrorWithCause | null;
}

export interface TUseZusModuleAndMicroAppOptions extends TUseZusModuleOptions {
  /** 微应用 appKey */
  microAppKey: string;
}

export interface TUseZusModuleAndMicroAppResult {
  isLoading: boolean;
  zusmodule: TZusModule | null;
  microApp: TAppMeta | null;
  error: TErrorWithCause | null;
}
