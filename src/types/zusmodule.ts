import type { TAppMeta, TZusModule } from '@xuqiyong666/zusloader';

export type TZusModuleStatus = 'loading' | 'ready' | 'error';

export interface TUseZusModuleOptions {
  zusmodule_manifest_url: string;
}

export interface TUseZusModuleResult {
  status: TZusModuleStatus;
  zusmodule: TZusModule | null;
  errorMessage: string | null;
}

export interface TUseZusModuleAndMicroAppOptions extends TUseZusModuleOptions {
  /** 微应用 appKey */
  microAppKey: string;
}

export interface TUseZusModuleAndMicroAppResult {
  status: TZusModuleStatus;
  zusmodule: TZusModule | null;
  microApp: TAppMeta | null;
  errorMessage: string | null;
}
