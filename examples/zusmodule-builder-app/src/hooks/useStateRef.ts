import { useRef } from 'react';

/**
 * 使用 ref 存储最新状态值，每次渲染时自动更新
 * 
 * 用途：简化 useCallback 的依赖项管理，通过 ref 访问最新值，避免频繁变化的值导致 useCallback 重新创建
 * 
 * @param getValue - 工厂函数，返回要存储的状态对象
 * @returns 可变的 ref 对象，每次渲染时自动更新为最新值
 * 
 * @example
 * ```ts
 * const stateRef = useStateRef(() => ({
 *   containerWidth: containerSize.width,
 *   containerHeight: containerSize.height,
 *   transform,
 *   // ...
 * }));
 * 
 * // 在 useCallback 中使用，依赖项只需包含 stateRef（或空数组）
 * const handleClick = useCallback(() => {
 *   const { transform } = stateRef.current;
 *   // 使用最新值
 * }, []);
 * ```
 */
export function useStateRef<T extends Record<string, any>>(
  getValue: () => T
): React.RefObject<T> {
  const ref = useRef<T>({} as T);
  
  // 每次渲染时调用工厂函数获取最新值，并更新到 ref 中
  const latestValue = getValue();
  Object.assign(ref.current, latestValue);
  
  return ref;
}

