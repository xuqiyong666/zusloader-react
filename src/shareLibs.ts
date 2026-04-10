/**
 * 宿主注入的共享运行时（如 react、axios）。
 * 具体 key 由宿主与子应用约定；包内保持宽松类型以便扩展。
 */
export type SingleAppShareLibs = Record<string, unknown>
