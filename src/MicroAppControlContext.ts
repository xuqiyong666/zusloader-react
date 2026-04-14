import { createContext } from 'react'

import type {
  HostSDKBase,
  MicroAppControlExtraState,
} from '@xuqiyong666/zusloader'
import type { MicroAppControlContextValue } from './types'

export const MicroAppControlContext =
  createContext<MicroAppControlContextValue<HostSDKBase, MicroAppControlExtraState> | null>(null)
