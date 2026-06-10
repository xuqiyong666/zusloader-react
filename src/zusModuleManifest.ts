import {
  loadZusModuleManifestResources,
  loadZusModuleFromManifestOrigin as loadZusModuleFromManifestOriginCore,
  type TBootstrapLoadOptions,
  type TManifest,
} from '@xuqiyong666/zusloader'

/**
 * @deprecated 请从 `@xuqiyong666/zusloader` 使用 `loadZusModuleManifestResources`。
 */
export async function loadZusModuleFromManifestUrl(
  manifestUrl: string,
  options?: TBootstrapLoadOptions
): Promise<TManifest> {
  return loadZusModuleManifestResources(manifestUrl, options)
}

/**
 * @deprecated 请优先使用 {@link loadZusModuleFromManifestUrl} 传入完整 manifest URL。
 * 等价于 `loadZusModuleFromManifestUrl(\`${origin.replace(/\/$/, '')}/manifest.json\`)`。
 */
export async function loadZusModuleFromManifestOrigin(
  origin: string,
  options?: TBootstrapLoadOptions
): Promise<TManifest> {
  return loadZusModuleFromManifestOriginCore(origin, options)
}

export type { TManifest }
