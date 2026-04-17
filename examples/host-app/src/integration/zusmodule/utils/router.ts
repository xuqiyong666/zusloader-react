/** 将查询串转为扁平 Record；同名参数后者覆盖前者（与 URLSearchParams 迭代顺序一致） */
export function searchParamsToRecord(sp: URLSearchParams): Record<string, string> {
  const out: Record<string, string> = {}
  sp.forEach((value, key) => {
    out[key] = value
  })
  return out
}

export function shallowEqual(
  a: Record<string, string>,
  b: Record<string, string>
): boolean {
  const keysA = Object.keys(a)
  const keysB = Object.keys(b)
  if (keysA.length !== keysB.length) {
    return false
  }
  for (const k of keysA) {
    if (a[k] !== b[k]) {
      return false
    }
  }
  return true
}

/** 从当前 URL 解析初始路由：params 为全部查询项；pagePath 无参时用 indexPagePath */
export function urlToRouterPayload(
  pagePath: string | undefined,
  searchParams: URLSearchParams,
  indexPagePath: string
): { path: string; params: Record<string, string> } {
  const params = searchParamsToRecord(searchParams)
  const path = pagePath ? `/${pagePath}` : indexPagePath
  return { path, params }
}
