import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import type { TAppMeta, TReactControlSDK } from 'zusloader-react'

type MicroAppRootProps = { control: TReactControlSDK; microApp: TAppMeta }

export type MicroAppLazyRoot = LazyExoticComponent<
  ComponentType<MicroAppRootProps>
>

const LazySampleApp1: MicroAppLazyRoot = lazy(() =>
  import('../../microApps/sampleApp1/index.tsx').then((m) => ({
    default: m.SampleApp1,
  })),
)

const LazySampleApp2: MicroAppLazyRoot = lazy(() =>
  import('../../microApps/sampleApp2/index.tsx').then((m) => ({
    default: m.SampleApp2,
  })),
)

/** appKey → 懒加载根组件；MicroAppMount 查表用 */
export const MICRO_APP_LAZY_ROOT_MAP: Partial<Record<string, MicroAppLazyRoot>> = {
  'sample-app-1': LazySampleApp1,
  'sample-app-2': LazySampleApp2,
}
