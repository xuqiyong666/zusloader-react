import type {
  TControlActions,
  TControlSDK,
  TControlState,
} from 'zusloader';

import type { TExtraActions, TExtraState } from './preference';

/** augmentation 后的 React 标准 control state */
export type TReactControlState = TControlState;

/** augmentation 后的 React 标准 control actions */
export type TReactControlActions = TControlActions;

/** augmentation 后的 React 标准 control SDK */
export type TReactControlSDK = TControlSDK;

/** 含用户自定义扩展字段的 control state */
export type TReactControlStateWithExtra<TExtra extends TExtraState = TExtraState> =
  TReactControlState & TExtra;

/** 含用户自定义扩展方法的 control actions */
export type TReactControlActionsWithExtra<TExtra extends TExtraActions = TExtraActions> =
  TReactControlActions & TExtra;
