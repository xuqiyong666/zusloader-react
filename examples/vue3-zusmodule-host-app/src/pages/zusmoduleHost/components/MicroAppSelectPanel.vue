<script setup lang="ts">
import { Select, theme } from 'ant-design-vue'
import { computed } from 'vue'
import type { TAppMeta, TZusModule } from 'zusloader'

export interface MicroAppSelectPanelProps {
  microAppKey?: string
  microApp?: TAppMeta
  pagePath?: string
  onMicroAppChange: (microAppKey: string) => void
  onPageChange: (path: string) => void
  zusmodule: TZusModule
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement
}

const props = defineProps<MicroAppSelectPanelProps>()

const { token } = theme.useToken()
const labelColor = computed(() => token.value.colorTextSecondary)

function resolvePopupContainer(triggerNode: HTMLElement) {
  if (props.getPopupContainer) {
    return props.getPopupContainer(triggerNode)
  }
  return triggerNode.parentElement ?? document.body
}

function handleMicroAppChange(value: unknown) {
  if (typeof value === 'string') {
    props.onMicroAppChange(value)
  }
}

function handlePageChange(value: unknown) {
  if (typeof value === 'string') {
    props.onPageChange(value)
  }
}

const microAppOptions = computed(() =>
  props.zusmodule.microApps.map((m) => ({
    label: `${m.displayName} (${m.appKey})`,
    value: m.appKey,
  })),
)

const pageOptions = computed(
  () =>
    props.microApp?.pageList.map((p) => ({
      label: `${p.title} (${p.path})`,
      value: p.path,
    })) ?? [],
)

const currentPagePath = computed(() => {
  if (!props.microApp) {
    return undefined
  }
  if (props.pagePath) {
    return `/${props.pagePath}`
  }
  return props.microApp.indexPagePath
})
</script>

<template>
  <div class="micro-app-select-panel">
    <div class="micro-app-select-panel__field">
      <div class="micro-app-select-panel__label" :style="{ color: labelColor }">
        选择 MicroApp
      </div>
      <Select
        :value="microAppKey"
        :disabled="!zusmodule"
        :options="microAppOptions"
        :get-popup-container="resolvePopupContainer"
        @change="handleMicroAppChange"
      />
    </div>

    <div class="micro-app-select-panel__field">
      <div class="micro-app-select-panel__label" :style="{ color: labelColor }">
        选择页面
      </div>
      <Select
        :value="currentPagePath"
        :disabled="!microApp || pageOptions.length === 0"
        :options="pageOptions"
        :get-popup-container="resolvePopupContainer"
        @change="handlePageChange"
      />
    </div>
  </div>
</template>

<style scoped>
.micro-app-select-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.micro-app-select-panel__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.micro-app-select-panel__label {
  font-size: 13px;
}
</style>
