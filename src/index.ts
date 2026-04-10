export {
  SINGLE_APP_HOST_DEFAULT_GLOBAL_KEY,
} from './constants'
export type { SingleAppHostFacade } from './facade'
export {
  destroySingleAppHost,
  getSingleAppHost,
  initSingleAppHost,
  type DuplicateInitBehavior,
  type InitSingleAppHostOptions,
} from './initSingleAppHost'
export type { SingleAppShareLibs } from './shareLibs'
export type {
  SubAppNavigationIntent,
  SubAppRouteSnapshot,
  SubAppRegistration,
} from './subApp'
