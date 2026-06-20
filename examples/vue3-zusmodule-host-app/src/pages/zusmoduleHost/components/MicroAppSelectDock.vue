<script setup lang="ts">
import { BugOutlined } from '@ant-design/icons-vue'
import { Alert, theme } from 'ant-design-vue'
import { computed, onUnmounted, ref, watch } from 'vue'

import {
  MICRO_APP_HOST_DOCK_EDGE_OFFSET,
  MICRO_APP_HOST_DOCK_ICON_SIZE,
  MICRO_APP_HOST_DOCK_PANEL_WIDTH,
} from '../constants'
import { useMicroAppHostDockDragY } from '../hooks/useMicroAppHostDockDragY'
import MicroAppSelectPanel, { type MicroAppSelectPanelProps } from './MicroAppSelectPanel.vue'

const props = defineProps<MicroAppSelectPanelProps>()

const { token } = theme.useToken()
const open = ref(false)
const dockRef = ref<HTMLDivElement | null>(null)
const panelRef = ref<HTMLDivElement | null>(null)

const {
  y,
  handlePointerDown,
  handlePointerMove,
  endDrag,
} = useMicroAppHostDockDragY()

const panelTop = computed(() => Math.min(y.value, window.innerHeight - 200))
const panelRight = MICRO_APP_HOST_DOCK_EDGE_OFFSET + MICRO_APP_HOST_DOCK_ICON_SIZE + 12

const triggerStyle = computed(() => ({
  touchAction: 'none',
  top: `${y.value}px`,
  right: `${MICRO_APP_HOST_DOCK_EDGE_OFFSET}px`,
  width: `${MICRO_APP_HOST_DOCK_ICON_SIZE}px`,
  height: `${MICRO_APP_HOST_DOCK_ICON_SIZE}px`,
  backgroundColor: token.value.colorBgElevated,
  border: `1px solid ${token.value.colorBorder}`,
  color: token.value.colorTextSecondary,
  boxShadow: token.value.boxShadowTertiary,
}))

const panelStyle = computed(() => ({
  top: `${panelTop.value}px`,
  right: `${panelRight}px`,
  width: `${MICRO_APP_HOST_DOCK_PANEL_WIDTH}px`,
  maxHeight: 'min(70vh, 520px)',
  backgroundColor: token.value.colorBgElevated,
  border: `1px solid ${token.value.colorBorderSecondary}`,
  borderRadius: `${token.value.borderRadiusLG}px`,
  boxShadow: token.value.boxShadowSecondary,
}))

function toggleOpen() {
  open.value = !open.value
}

function closePanel() {
  open.value = false
}

function handlePointerDownOutside(event: PointerEvent) {
  const target = event.target
  if (!(target instanceof Node)) {
    return
  }

  if (dockRef.value?.contains(target)) {
    return
  }

  if (target instanceof Element && target.closest('.ant-select-dropdown')) {
    return
  }

  closePanel()
}

let removeOutsideListener: (() => void) | null = null

watch(open, (isOpen) => {
  removeOutsideListener?.()
  removeOutsideListener = null

  if (!isOpen) {
    return
  }

  document.addEventListener('pointerdown', handlePointerDownOutside)
  removeOutsideListener = () => {
    document.removeEventListener('pointerdown', handlePointerDownOutside)
  }
})

onUnmounted(() => {
  removeOutsideListener?.()
})

function resolvePanelPopupContainer(triggerNode: HTMLElement) {
  return panelRef.value ?? triggerNode.parentElement ?? document.body
}

function handleIconPointerUp(event: PointerEvent) {
  const moved = endDrag(event)
  if (!moved) {
    toggleOpen()
  }
}
</script>

<template>
  <Teleport to="body">
    <div ref="dockRef" class="micro-app-select-dock">
      <button
        type="button"
        class="micro-app-select-dock__trigger"
        aria-label="切换 MicroApp 调试面板"
        :aria-expanded="open"
        :style="triggerStyle"
        @pointerdown="handlePointerDown"
        @pointermove="handlePointerMove"
        @pointerup="handleIconPointerUp"
        @pointercancel="handleIconPointerUp"
      >
        <BugOutlined :style="{ fontSize: '20px' }" />
      </button>

      <div v-if="open" class="micro-app-select-dock__panel-wrap">
        <div ref="panelRef" class="micro-app-select-dock__panel" :style="panelStyle">
          <Alert
            type="info"
            show-icon
            description="仅用于本地调试：切换远程子模块与页面路由。"
          />
          <MicroAppSelectPanel
            v-bind="props"
            :get-popup-container="resolvePanelPopupContainer"
          />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.micro-app-select-dock {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
}

.micro-app-select-dock__trigger {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: grab;
  pointer-events: auto;
  padding: 0;
}

.micro-app-select-dock__panel-wrap {
  pointer-events: auto;
}

.micro-app-select-dock__panel {
  position: fixed;
  z-index: 10000;
  padding: 12px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-sizing: border-box;
}
</style>
