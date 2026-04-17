import { createContext } from 'react'

import type { MicroAppControlSDK } from '@xuqiyong666/zusloader'

export const MicroAppControlContext = createContext<MicroAppControlSDK | null>(null)
