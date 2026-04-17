import type { MicroAppControlSDK } from '@xuqiyong666/zusloader'

export type MicroAppControlContextValue<
  TExtraState extends Record<string, unknown> = {},
  TExtraActions extends Record<string, unknown> | void = void,
> = MicroAppControlSDK<TExtraState, TExtraActions>
