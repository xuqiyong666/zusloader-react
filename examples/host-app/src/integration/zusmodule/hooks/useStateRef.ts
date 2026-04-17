import { useRef, type RefObject } from 'react';

/**
 * 使用 ref 存储最新快照，每次渲染时用工厂返回值 `Object.assign` 到同一 ref。
 * 用于稳定函数引用：handler 内读 `ref.current` 获取最新 props/state。
 */
export function useStateRef<T extends Record<string, unknown>>(
  getValue: () => T
): RefObject<T> {
  const ref = useRef<T>({} as T);
  Object.assign(ref.current, getValue());
  return ref;
}
