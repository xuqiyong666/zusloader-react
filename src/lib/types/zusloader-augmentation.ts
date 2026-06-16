import type { TPreferenceActions, TPreferenceState, TRootLayoutActions } from './preference';

declare module 'zusloader' {
  interface THostExtensionState extends TPreferenceState {}
  interface THostExtensionActions extends TPreferenceActions, TRootLayoutActions {}
}

export {};
