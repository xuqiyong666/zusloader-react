/** 与 `xxx-hub-sub-module` 的 `ZusModuleManifestPlugin` 输出对齐 */
export interface ZusModuleManifest {
  version: number
  zusmoduleKey?: string
  ZUS_LOADER_GLOBAL_KEY: string
  entries: Array<{
    type: string
    href: string
    module?: boolean
  }>
}

function manifestDirectoryUrl(manifestUrl: string): string {
  return new URL('./', manifestUrl).href
}

function loadModuleScript(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const id = `zus-module-script-${url}`
    const existing = document.getElementById(id) as HTMLScriptElement | null
    if (existing) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.id = id
    script.type = 'module'
    script.src = url
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`module 脚本加载失败: ${url}`))
    document.head.appendChild(script)
  })
}

/**
 * 拉取指定 manifest URL，注入 CSS，并按顺序 `import()` ESM 入口（子模块内会 `registerZusModule`）。
 */
export async function loadZusModuleFromManifestUrl(
  manifestUrl: string
): Promise<ZusModuleManifest> {
  const res = await fetch(manifestUrl)
  if (!res.ok) {
    throw new Error(`manifest 请求失败: ${res.status} ${manifestUrl}`)
  }
  const manifest = (await res.json()) as ZusModuleManifest
  const manifestBase = manifestDirectoryUrl(manifestUrl)

  for (const entry of manifest.entries) {
    const url = new URL(entry.href, manifestBase).href
    if (entry.type === 'stylesheet') {
      const id = `zus-module-stylesheet-${url}`
      if (document.getElementById(id)) {
        continue
      }
      const link = document.createElement('link')
      link.id = id
      link.rel = 'stylesheet'
      link.href = url
      document.head.appendChild(link)
    } else if (entry.type === 'script' && entry.module) {
      await loadModuleScript(url)
    }
  }
  return manifest
}

/**
 * @deprecated 请优先使用 {@link loadZusModuleFromManifestUrl} 传入完整 manifest URL。
 * 等价于 `loadZusModuleFromManifestUrl(\`${origin.replace(/\/$/, '')}/manifest.json\`)`。
 */
export async function loadZusModuleFromManifestOrigin(
  origin: string
): Promise<ZusModuleManifest> {
  const base = origin.replace(/\/$/, '')
  return loadZusModuleFromManifestUrl(`${base}/manifest.json`)
}
