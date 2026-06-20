import { onMounted, onUnmounted, ref } from 'vue'

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
  const y = ref(readStoredY())
  const dragStateRef = ref<{
    pointerId: number
    startClientY: number
    startY: number
    moved: boolean
  } | null>(null)

  function persistY(nextY: number) {
    const clamped = clampY(nextY)
    y.value = clamped
    localStorage.setItem(MICRO_APP_HOST_DOCK_Y_STORAGE_KEY, String(clamped))
  }

  function handleResize() {
    y.value = clampY(y.value)
  }

  onMounted(() => {
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })

  function handlePointerDown(event: PointerEvent) {
    const target = event.currentTarget
    if (!(target instanceof HTMLButtonElement)) {
      return
    }

    dragStateRef.value = {
      pointerId: event.pointerId,
      startClientY: event.clientY,
      startY: y.value,
      moved: false,
    }
    target.setPointerCapture(event.pointerId)
  }

  function handlePointerMove(event: PointerEvent) {
    const dragState = dragStateRef.value
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
  }

  function endDrag(event: PointerEvent): boolean {
    const dragState = dragStateRef.value
    if (!dragState || dragState.pointerId !== event.pointerId) {
      return false
    }

    const target = event.currentTarget
    if (target instanceof HTMLButtonElement && target.hasPointerCapture(event.pointerId)) {
      target.releasePointerCapture(event.pointerId)
    }

    const moved = dragState.moved
    dragStateRef.value = null
    return moved
  }

  return {
    y,
    handlePointerDown,
    handlePointerMove,
    endDrag,
  }
}
