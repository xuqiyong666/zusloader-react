import { useEffect, useRef, useState } from 'react'

import {
  bootstrapZusModuleFromManifestUrl,
  finalizeZusModuleFromManifestUrl,
  type ZusModule,
} from '@xuqiyong666/zusloader'

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
    const controller = new AbortController()
    const signal = controller.signal
    setStatus('loading')
    setErrorMessage(null)
    setZusmodule(null)

    const manifestUrl = zusmodule_manifest_url

    void (async () => {
      try {
        let resolvedModuleKey: string | null = null
        if (loadedManifestUrlRef.current !== manifestUrl) {
          const { manifest } = await bootstrapZusModuleFromManifestUrl(manifestUrl, { signal })
          resolvedModuleKey = manifest.zusmoduleKey ?? null
          loadedManifestUrlRef.current = manifestUrl
          loadedModuleKeyRef.current = resolvedModuleKey
        } else {
          resolvedModuleKey = loadedModuleKeyRef.current
        }
        if (!resolvedModuleKey) {
          throw new Error('manifest 中缺少 zusmoduleKey。')
        }

        const registered = await finalizeZusModuleFromManifestUrl(manifestUrl, resolvedModuleKey, {
          signal,
        })
        setZusmodule(registered)
        setStatus('ready')
      } catch (e) {
        if (signal.aborted) {
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
      controller.abort()
    }
  }, [zusmodule_manifest_url])

  return { status, zusmodule, errorMessage }
}
