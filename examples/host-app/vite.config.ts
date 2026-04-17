import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {

  // 加载环境变量
  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
    server: {
      host: "0.0.0.0", // 监听所有网络接口，允许局域网访问
      port: parseInt(env.NODE_PORT || '5002', 10), // 可通过 NODE_PORT 环境变量配置，默认 16001
      proxy: {
        '/api': {
          target: "http://192.168.3.120",
          // ws: 'ws://0.0.0.0:3000',
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
  }
})
