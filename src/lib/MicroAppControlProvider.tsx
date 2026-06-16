import { useContext, type ReactNode } from 'react';

import { MicroAppControlContext } from './MicroAppControlContext';
import type { TReactControlSDK } from './types/react-control';

interface ProviderProps {
  control: TReactControlSDK;
  children: ReactNode;
}

export function MicroAppControlProvider({ control, children }: ProviderProps) {
  return (
    <MicroAppControlContext.Provider value={control}>
      {children}
    </MicroAppControlContext.Provider>
  );
}

export function useMicroAppControl(): TReactControlSDK {
  const ctx = useContext(MicroAppControlContext);
  if (!ctx) {
    throw new Error('useMicroAppControl must be used within MicroAppControlContext.Provider');
  }
  return ctx;
}
