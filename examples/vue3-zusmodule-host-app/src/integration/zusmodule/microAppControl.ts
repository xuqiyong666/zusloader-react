export const DEFAULT_APP_LANGUAGE = 'zh-CN' as const

export type AppLanguage = 'zh-CN' | 'en-US'

export function resolveAppLanguage(value: string | undefined): AppLanguage {
  if (!value) {
    return DEFAULT_APP_LANGUAGE
  }

  const [languagePart] = value.trim().split('-')
  if (languagePart?.toLowerCase() === 'en') {
    return 'en-US'
  }

  return 'zh-CN'
}
