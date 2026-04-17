/** `window` 上主应用门面的属性名，须与子应用、文档保持一致 */
export const MAIN_APP_WINDOW_KEY = '__MainApp__' as const

export type MainAppWindowKey = typeof MAIN_APP_WINDOW_KEY
