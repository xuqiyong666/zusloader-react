import { watchEffect } from 'vue'

/**
 * 使用 ref 存储最新快照，每次依赖变化时用工厂返回值 Object.assign 到同一 ref。
 * 用于稳定函数引用：handler 内读 ref.current 获取最新 props/state。
 */
export function useStateRef<T extends Record<string, unknown>>(getValue: () => T): { current: T } {
  const ref = { current: {} as T }
  watchEffect(() => {
    Object.assign(ref.current, getValue())
  })
  return ref
}
