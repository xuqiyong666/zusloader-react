/** 开发壳使用的 MicroApp 登记表（与构建 manifest 可后续对齐） */

import type { TAppMeta } from 'zusloader-react'

export const microApps: TAppMeta[] = [
  {
    appKey: 'sample-app-1',
    displayName: 'Sample App 1',
    indexPagePath: '/page1',
    pageList: [
      { path: '/page1', title: '页面 1' },
      { path: '/page2', title: '页面 2' },
    ],
  },
  {
    appKey: 'sample-app-2',
    displayName: 'Sample App 2',
    indexPagePath: '/page1',
    pageList: [
      { path: '/page1', title: '页面 1' },
      { path: '/page2', title: '页面 2' },
    ],
  },
]

export function getMicroAppByKey(
  appKey: string | undefined
): TAppMeta | undefined {
  if (!appKey) {
    return undefined
  }
  return microApps.find((e) => e.appKey === appKey)
}
