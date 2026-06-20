import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { BugOutlined } from '@ant-design/icons'
import { Alert, theme } from 'antd'
import { Box } from 'chakbox-ui'

import {
  MICRO_APP_HOST_DOCK_EDGE_OFFSET,
  MICRO_APP_HOST_DOCK_ICON_SIZE,
  MICRO_APP_HOST_DOCK_PANEL_WIDTH,
} from '../constants'
import { useMicroAppHostDockDragY } from '../hooks/useMicroAppHostDockDragY'
import MicroAppSelectPanel, { type MicroAppSelectPanelProps } from './MicroAppSelectPanel'

export type MicroAppSelectDockProps = MicroAppSelectPanelProps

export default function MicroAppSelectDock(props: MicroAppSelectDockProps) {
  const { token } = theme.useToken()
  const [open, setOpen] = useState(false)
  const dockRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const {
    y,
    handlePointerDown,
    handlePointerMove,
    endDrag,
  } = useMicroAppHostDockDragY()

  const toggleOpen = useCallback(() => {
    setOpen((current) => !current)
  }, [])

  const closePanel = useCallback(() => {
    setOpen(false)
  }, [])

  useEffect(() => {
    if (!open) {
      return
    }

    const handlePointerDownOutside = (event: PointerEvent) => {
      const target = event.target
      if (!(target instanceof Node)) {
        return
      }

      if (dockRef.current?.contains(target)) {
        return
      }

      if (target instanceof Element && target.closest('.ant-select-dropdown')) {
        return
      }

      closePanel()
    }

    document.addEventListener('pointerdown', handlePointerDownOutside)
    return () => document.removeEventListener('pointerdown', handlePointerDownOutside)
  }, [closePanel, open])

  const handleIconPointerUp = useCallback((event: React.PointerEvent<HTMLButtonElement>) => {
    const moved = endDrag(event)
    if (!moved) {
      toggleOpen()
    }
  }, [endDrag, toggleOpen])

  const panelTop = Math.min(y, window.innerHeight - 200)
  const panelRight = MICRO_APP_HOST_DOCK_EDGE_OFFSET + MICRO_APP_HOST_DOCK_ICON_SIZE + 12

  return createPortal(
    <Box ref={dockRef} position="fixed" inset={0} pointerEvents="none" zIndex={9999}>
      <Box
        as="button"
        type="button"
        aria-label="切换 MicroApp 调试面板"
        aria-expanded={open}
        position="fixed"
        display="flex"
        alignItems="center"
        justifyContent="center"
        borderRadius="50%"
        cursor="grab"
        pointerEvents="auto"
        style={{
          touchAction: 'none',
          top: y,
          right: MICRO_APP_HOST_DOCK_EDGE_OFFSET,
          width: MICRO_APP_HOST_DOCK_ICON_SIZE,
          height: MICRO_APP_HOST_DOCK_ICON_SIZE,
          backgroundColor: token.colorBgElevated,
          border: `1px solid ${token.colorBorder}`,
          color: token.colorTextSecondary,
          boxShadow: token.boxShadowTertiary,
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handleIconPointerUp}
        onPointerCancel={handleIconPointerUp}
      >
        <BugOutlined style={{ fontSize: 20 }} />
      </Box>

      {open ? (
        <Box pointerEvents="auto">
          <Box
            ref={panelRef}
            position="fixed"
            zIndex={10000}
            p={12}
            style={{
              top: panelTop,
              right: panelRight,
              width: MICRO_APP_HOST_DOCK_PANEL_WIDTH,
              maxHeight: 'min(70vh, 520px)',
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              backgroundColor: token.colorBgElevated,
              border: `1px solid ${token.colorBorderSecondary}`,
              borderRadius: token.borderRadiusLG,
              boxShadow: token.boxShadowSecondary,
            }}
          >
            <Alert
              type="info"
              showIcon
              description="仅用于本地调试：切换远程子模块与页面路由。"
            />
            <MicroAppSelectPanel {...props} popupContainerRef={panelRef} />
          </Box>
        </Box>
      ) : null}
    </Box>,
    document.body,
  )
}
