import path from 'node:path'
import { fileURLToPath } from 'node:url'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

import { zusModuleManifestPlugin } from './config/vite-zus-module-manifest-plugin'
import { ZUS_MODULE_KEY } from './src/system/zusmoduleKey'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** zus-module 唯一 Rollup 入口：决定 dist-submodule 主 chunk 内容及 mountMicroApp 契约 */
const zusModuleBuildEntry = path.resolve(
  __dirname,
  'src/zusmodule/zusmoduleEntry.tsx'
)

/** 用于 manifest 插件识别主 chunk 的匹配模式（不含扩展名，与 facadeModuleId 匹配） */
const zusModuleEntryPattern = 'src/zusmodule/zusmoduleEntry'

export default defineConfig({
  plugins: [
    react(),
    zusModuleManifestPlugin({ 
      entryPattern: zusModuleEntryPattern,
      zusmoduleKey: ZUS_MODULE_KEY
    })
  ],
  base: './', // 相对路径：作为子路径加载时资源可解析
  build: {
    outDir: 'dist-zusmodule',
    emptyOutDir: true,
    rollupOptions: {
      input: zusModuleBuildEntry,
    },
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
})
