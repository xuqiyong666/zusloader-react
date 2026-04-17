import { useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import type { HostSDKBase } from '@xuqiyong666/zusloader'

export function useNavigateForMicroApp(): HostSDKBase['navigate'] {
  const navigate = useNavigate()

  // 使用 ref 保证引用稳定，避免 useMemo 依赖问题
  const navigateRef = useRef(navigate)
  navigateRef.current = navigate

  // 返回符合 HostSDKBase.navigate 签名的稳定函数
  return useCallback((path: string, params?: Record<string, string>, replace?: boolean) => {
    const queryString = params
      ? '?' + new URLSearchParams(params).toString()
      : ''
    navigateRef.current(`${path}${queryString}`, { replace })
  }, [])
}