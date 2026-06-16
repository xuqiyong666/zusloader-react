import { createContext } from 'react';

import type { TReactControlSDK } from './types/react-control';

export const MicroAppControlContext = createContext<TReactControlSDK | null>(null);
