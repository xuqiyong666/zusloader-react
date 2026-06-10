import { createContext } from 'react';

import type { TControlSDK } from './types/control';

export const MicroAppControlContext = createContext<TControlSDK | null>(null);
