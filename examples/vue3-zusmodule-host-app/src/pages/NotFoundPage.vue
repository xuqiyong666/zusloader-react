<script setup lang="ts">
import { Button, Result } from 'ant-design-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function goDashboard() {
  router.push('/dashboard')
}
</script>

<template>
  <Result
    status="404"
    title="404"
    sub-title="当前路径不存在。"
  >
    <template #extra>
      <Button type="primary" @click="goDashboard">返回工作台</Button>
    </template>
  </Result>
</template>
