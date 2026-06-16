import type { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';

import type { TAppMeta } from 'zusloader';

import { MicroAppControlProvider } from './MicroAppControlProvider';
import type { TReactControlSDK } from './types/react-control';
import type { TReactMountOptions, TReactMountResult } from './types/react-zusmodule';

export interface TReactMountMicroAppRenderContext {
  microApp: TAppMeta;
  control: TReactControlSDK;
}

export function mountMicroApp(
  options: TReactMountOptions,
  render: (context: TReactMountMicroAppRenderContext) => ReactNode,
): TReactMountResult {
  const { mountElement, microApp, control } = options;
  const root = createRoot(mountElement);

  root.render(
    <MicroAppControlProvider control={control}>
      {render({ microApp, control })}
    </MicroAppControlProvider>,
  );

  return {
    unmount: () => {
      root.unmount();
    },
  };
}

export function createReactMountMicroApp(
  render: (context: TReactMountMicroAppRenderContext) => ReactNode,
): (options: TReactMountOptions) => TReactMountResult {
  return (options) => mountMicroApp(options, render);
}
