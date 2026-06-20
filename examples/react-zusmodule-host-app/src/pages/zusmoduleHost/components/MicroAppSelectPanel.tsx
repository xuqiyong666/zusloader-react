import { useCallback, type RefObject } from 'react'
import { Select, theme } from 'antd'
import { Text, VStack } from 'chakbox-ui'
import type { TAppMeta, TReactZusModule } from 'zusloader-react'

export interface MicroAppSelectPanelProps {
  microAppKey?: string
  microApp?: TAppMeta
  pagePath?: string
  onMicroAppChange: (microAppKey: string) => void
  onPageChange: (path: string) => void
  zusmodule: TReactZusModule
  popupContainerRef?: RefObject<HTMLElement | null>
}

export default function MicroAppSelectPanel({
  microAppKey,
  microApp,
  pagePath,
  onMicroAppChange,
  onPageChange,
  zusmodule,
  popupContainerRef,
}: MicroAppSelectPanelProps) {
  const { token } = theme.useToken()

  const getPopupContainer = useCallback(
    (triggerNode: HTMLElement) => popupContainerRef?.current ?? triggerNode.parentElement ?? document.body,
    [popupContainerRef],
  )

  const microAppOptions = zusmodule.microApps.map((m) => ({
    label: `${m.displayName} (${m.appKey})`,
    value: m.appKey,
  }))

  const pageOptions =
    microApp?.pageList.map((p) => ({
      label: `${p.title} (${p.path})`,
      value: p.path,
    })) ?? []

  const currentPagePath = microApp
    ? (pagePath ? `/${pagePath}` : microApp.indexPagePath)
    : undefined

  return (
    <VStack align="stretch" gap={12}>
      <VStack align="stretch" gap={6}>
        <Text fontSize={13} color={token.colorTextSecondary}>
          选择 MicroApp
        </Text>
        <Select
          value={microAppKey}
          disabled={!zusmodule}
          options={microAppOptions}
          onChange={onMicroAppChange}
          getPopupContainer={getPopupContainer}
        />
      </VStack>

      <VStack align="stretch" gap={6}>
        <Text fontSize={13} color={token.colorTextSecondary}>
          选择页面
        </Text>
        <Select
          value={currentPagePath}
          disabled={!microApp || pageOptions.length === 0}
          options={pageOptions}
          onChange={onPageChange}
          getPopupContainer={getPopupContainer}
        />
      </VStack>
    </VStack>
  )
}
