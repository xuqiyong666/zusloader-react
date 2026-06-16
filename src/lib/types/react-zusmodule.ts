import type {
  TMountOptions,
  TMountResult,
  TZusModule,
} from 'zusloader';

/** React 宿主挂载入参（`control` 经 augmentation 含 preference / root layout） */
export type TReactMountOptions = TMountOptions;

export type TReactMountResult = TMountResult;

/** React 消费侧 ZusModule（与 core `TZusModule` 同构，语义上要求 React 标准 control） */
export type TReactZusModule = TZusModule;

export type TDefineReactZusModuleInput = Omit<TZusModule, 'mountMicroApp'> & {
  mountMicroApp: (options: TReactMountOptions) => TReactMountResult;
};

export function defineReactZusModule(def: TDefineReactZusModuleInput): TReactZusModule {
  return def;
}
