import { createContext } from 'react'

import type { MicroAppControlContextValue } from './types'

export const MicroAppControlContext =
  createContext<MicroAppControlContextValue | null>(null)
