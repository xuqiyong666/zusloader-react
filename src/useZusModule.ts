import { useEffect, useRef, useState } from 'react'

import zusloader, { type ZusModule } from '@xuqiyong666/zusloader'

import { loadZusModuleFromManifestUrl } from './zusModuleManifest'

export type ZusModuleStatus = 'loading' | 'ready' | 'error'

export interface UseZusModuleOptions {
  zusmodule_manifest_url: string
}

export interface UseZusModuleResult {
  status: ZusModuleStatus
  zusmodule: ZusModule | null
  errorMessage: string | null
}

/** 按 manifest URL 拉取并执行 zus-module，从 zusloader 取已注册模块。 */
export function useZusModule(options: UseZusModuleOptions): UseZusModuleResult {
  const { zusmodule_manifest_url } = options

  const [status, setStatus] = useState<ZusModuleStatus>('loading')
  const [zusmodule, setZusmodule] = useState<ZusModule | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const loadedManifestUrlRef = useRef<string | null>(null)
  const loadedModuleKeyRef = useRef<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    setErrorMessage(null)
    setZusmodule(null)

    const manifestUrl = zusmodule_manifest_url

    void (async () => {
      try {
        let resolvedModuleKey: string | null = null
        if (loadedManifestUrlRef.current !== manifestUrl) {
          const manifest = await loadZusModuleFromManifestUrl(manifestUrl)
          if (cancelled) {
            return
          }
          resolvedModuleKey = manifest.zusmoduleKey ?? null
          loadedManifestUrlRef.current = manifestUrl
          loadedModuleKeyRef.current = resolvedModuleKey
        } else {
          resolvedModuleKey = loadedModuleKeyRef.current
        }
        if (!resolvedModuleKey) {
          throw new Error('manifest 中缺少 zusmoduleKey。')
        }

        const registered = zusloader.getRegisteredZusModule(resolvedModuleKey)
        if (!registered) {
          throw new Error(
            `未在 zusloader 中找到模块「${resolvedModuleKey}」，请确认子模块入口已执行 registerZusModule。`
          )
        }
        if (registered.microApps.length === 0) {
          throw new Error('子模块 microApps 为空，无法挂载。')
        }
        if (cancelled) {
          return
        }
        const servedPath = new URL('.', manifestUrl).href
        registered.updateConfig({ servedPath })
        setZusmodule(registered)
        setStatus('ready')
      } catch (e) {
        if (cancelled) {
          return
        }
        loadedManifestUrlRef.current = null
        loadedModuleKeyRef.current = null
        setZusmodule(null)
        setStatus('error')
        setErrorMessage(e instanceof Error ? e.message : String(e))
      }
    })()

    return () => {
      cancelled = true
    }
  }, [zusmodule_manifest_url])

  return { status, zusmodule, errorMessage }
}
