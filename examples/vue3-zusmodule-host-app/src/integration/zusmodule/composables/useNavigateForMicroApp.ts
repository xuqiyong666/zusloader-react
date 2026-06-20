import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { THostSDKBase } from 'zusloader'

export function useNavigateForMicroApp(): THostSDKBase['navigate'] {
  const router = useRouter()
  const routerRef = ref(router)
  routerRef.value = router

  return (path: string, params?: Record<string, string>, replace?: boolean) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : ''
    const target = `${path}${queryString}`
    if (replace) {
      void routerRef.value.replace(target)
      return
    }
    void routerRef.value.push(target)
  }
}
