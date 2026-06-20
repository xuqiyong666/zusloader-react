import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react'

import {
  MICRO_APP_HOST_DOCK_DRAG_THRESHOLD,
  MICRO_APP_HOST_DOCK_ICON_SIZE,
  MICRO_APP_HOST_DOCK_SAFE_BOTTOM,
  MICRO_APP_HOST_DOCK_SAFE_TOP,
  MICRO_APP_HOST_DOCK_Y_STORAGE_KEY,
} from '../constants'

function clampY(nextY: number): number {
  const maxY = window.innerHeight - MICRO_APP_HOST_DOCK_ICON_SIZE - MICRO_APP_HOST_DOCK_SAFE_BOTTOM
  return Math.min(Math.max(nextY, MICRO_APP_HOST_DOCK_SAFE_TOP), Math.max(maxY, MICRO_APP_HOST_DOCK_SAFE_TOP))
}

function readStoredY(): number {
  const stored = localStorage.getItem(MICRO_APP_HOST_DOCK_Y_STORAGE_KEY)
  const parsed = stored ? Number(stored) : NaN
  if (Number.isFinite(parsed)) {
    return clampY(parsed)
  }

  return clampY((window.innerHeight - MICRO_APP_HOST_DOCK_ICON_SIZE) / 2)
}

export function useMicroAppHostDockDragY() {
  const [y, setY] = useState(readStoredY)
  const dragStateRef = useRef<{
    pointerId: number
    startClientY: number
    startY: number
    moved: boolean
  } | null>(null)

  useEffect(() => {
    const handleResize = () => {
      setY((current) => clampY(current))
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const persistY = useCallback((nextY: number) => {
    const clamped = clampY(nextY)
    setY(clamped)
    localStorage.setItem(MICRO_APP_HOST_DOCK_Y_STORAGE_KEY, String(clamped))
  }, [])

  const handlePointerDown = useCallback((event: PointerEvent<HTMLButtonElement>) => {
    dragStateRef.current = {
      pointerId: event.pointerId,
      startClientY: event.clientY,
      startY: y,
      moved: false,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }, [y])

  const handlePointerMove = useCallback((event: PointerEvent<HTMLButtonElement>) => {
    const dragState = dragStateRef.current
    if (!dragState || dragState.pointerId !== event.pointerId) {
      return
    }

    const deltaY = event.clientY - dragState.startClientY
    if (Math.abs(deltaY) >= MICRO_APP_HOST_DOCK_DRAG_THRESHOLD) {
      dragState.moved = true
    }

    if (dragState.moved) {
      persistY(dragState.startY + deltaY)
    }
  }, [persistY])

  const endDrag = useCallback((event: PointerEvent<HTMLButtonElement>) => {
    const dragState = dragStateRef.current
    if (!dragState || dragState.pointerId !== event.pointerId) {
      return
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    const moved = dragState.moved
    dragStateRef.current = null
    return moved
  }, [])

  return {
    y,
    handlePointerDown,
    handlePointerMove,
    endDrag,
  }
}
