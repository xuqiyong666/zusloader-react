<script setup lang="ts">
import { Alert, Spin } from 'ant-design-vue'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { TAppMeta } from 'zusloader'

import { useNavigateForMicroApp } from '../../integration/zusmodule/composables/useNavigateForMicroApp'
import { useZusModule } from '../../integration/zusmodule/composables/useZusModule'
import { useZusModuleRunner } from '../../integration/zusmodule/composables/useZusModuleRunner'
import MicroAppSelectDock from './components/MicroAppSelectDock.vue'
import {
  DEFAULT_MANIFEST_URL,
  PREFIX_PATH,
  isMicroAppHostDevDockEnabled,
} from './constants'

const route = useRoute()
const navigate = useNavigateForMicroApp()
const rootDomRef = ref<HTMLDivElement | null>(null)

const paramsAppKey = computed(() => {
  const value = route.params.microAppKey
  return typeof value === 'string' ? value : undefined
})

const pagePath = computed(() => {
  const value = route.params.pagePath
  if (Array.isArray(value)) {
    return value.join('/')
  }
  return typeof value === 'string' ? value : undefined
})

const { isLoading, zusmodule, error } = useZusModule(DEFAULT_MANIFEST_URL)

const microApp = computed<TAppMeta | undefined>(() => {
  const module = zusmodule.value
  if (!module?.microApps?.length) {
    return undefined
  }

  if (paramsAppKey.value) {
    return module.microApps.find((app) => app.appKey === paramsAppKey.value)
  }

  return module.microApps[0]
})

const basePath = computed(() => {
  if (!microApp.value) {
    return ''
  }
  return `${PREFIX_PATH}/${microApp.value.appKey}`
})

useZusModuleRunner({
  rootDomRef,
  zusmodule,
  microApp,
  basePath,
  pagePath,
})

function handleMicroAppChange(appKey: string) {
  const nextMicroApp = zusmodule.value?.microApps.find((app) => app.appKey === appKey)
  const indexSplat = nextMicroApp?.indexPagePath.replace(/^\//, '') ?? ''
  if (indexSplat) {
    navigate(`${PREFIX_PATH}/${appKey}/${indexSplat}`)
    return
  }
  navigate(`${PREFIX_PATH}/${appKey}`)
}

function handlePageChange(path: string) {
  if (!microApp.value) {
    return
  }
  const splat = path.startsWith('/') ? path.slice(1) : path
  navigate(`${PREFIX_PATH}/${microApp.value.appKey}/${splat}`)
}
</script>

<template>
  <div class="zusmodule-host-page">
    <div v-if="isLoading" class="zusmodule-host-page__center">
      <Spin spinning />
    </div>

    <Alert
      v-else-if="error"
      type="error"
      :message="error.message || '未知异常'"
      show-icon
      class="zusmodule-host-page__alert"
    />

    <Alert
      v-else-if="zusmodule && paramsAppKey && !microApp"
      type="error"
      :message="`MicroApp 未找到: appKey「${paramsAppKey}」不存在`"
      show-icon
      class="zusmodule-host-page__alert"
    />

    <div v-else-if="zusmodule && microApp" class="zusmodule-host-page__mount-wrap">
      <div ref="rootDomRef" class="zusmodule-host-page__mount" />
    </div>

    <MicroAppSelectDock
      v-if="zusmodule && isMicroAppHostDevDockEnabled()"
      :micro-app-key="microApp?.appKey"
      :micro-app="microApp"
      :page-path="pagePath"
      :zusmodule="zusmodule"
      :on-micro-app-change="handleMicroAppChange"
      :on-page-change="handlePageChange"
    />
  </div>
</template>

<style scoped>
.zusmodule-host-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 100%;
}

.zusmodule-host-page__center {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.zusmodule-host-page__alert {
  margin-bottom: 16px;
}

.zusmodule-host-page__mount-wrap {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.zusmodule-host-page__mount {
  flex: 1;
  min-height: 0;
}
</style>
