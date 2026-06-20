<script setup lang="ts">
import { AppstoreOutlined, DashboardOutlined } from '@ant-design/icons-vue'
import { Layout, Menu } from 'ant-design-vue'
import type { MenuProps } from 'ant-design-vue'
import { computed, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const SIDER_WIDTH = 220

type MenuItemMeta = {
  key: string
  label: string
  icon: () => ReturnType<typeof h>
}

const router = useRouter()
const route = useRoute()

const menuItems: MenuItemMeta[] = [
  {
    key: '/dashboard',
    label: '工作台',
    icon: () => h(DashboardOutlined),
  },
  {
    key: '/zusmodule',
    label: '远程子模块',
    icon: () => h(AppstoreOutlined),
  },
]

const selectedKey = computed(() => {
  const path = route.path
  const hit = menuItems.find((item) => path.startsWith(item.key))
  return hit?.key ?? '/dashboard'
})

const antMenuItems = computed<MenuProps['items']>(() =>
  menuItems.map((item) => ({
    key: item.key,
    label: item.label,
    icon: item.icon,
  })),
)

function handleMenuClick({ key }: { key: string | number }) {
  router.push(String(key))
}
</script>

<template>
  <Layout class="admin-layout">
    <Layout.Sider
      :width="SIDER_WIDTH"
      breakpoint="lg"
      :collapsed-width="64"
      theme="light"
      style="border-inline-end: 1px solid var(--ant-color-border-secondary, #f0f0f0)"
    >
      <div class="admin-layout__brand">Vue3 Host</div>
      <Menu
        mode="inline"
        :selected-keys="[selectedKey]"
        :items="antMenuItems"
        style="border-inline-end: 0; margin-top: 8px"
        @click="handleMenuClick"
      />
    </Layout.Sider>
    <Layout class="admin-layout__main">
      <Layout.Header class="admin-layout__header">主应用 · 宿主</Layout.Header>
      <Layout.Content class="admin-layout__content">
        <router-view />
      </Layout.Content>
    </Layout>
  </Layout>
</template>

<style scoped>
.admin-layout {
  min-height: 100vh;
  height: 100vh;
}

.admin-layout__main {
  flex: 1;
  min-height: 0;
}
.admin-layout__brand {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 15px;
  border-bottom: 1px solid var(--ant-color-border-secondary, #f0f0f0);
}

.admin-layout__header {
  padding-inline: 24px;
  background: var(--ant-color-bg-container, #fff);
  border-bottom: 1px solid var(--ant-color-border-secondary, #f0f0f0);
  line-height: 64px;
  height: 64px;
  flex-shrink: 0;
}

.admin-layout__content {
  margin: 24px;
  padding: 24px;
  background: var(--ant-color-bg-container, #fff);
  border-radius: 8px;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
