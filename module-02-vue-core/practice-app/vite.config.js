import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    // 固定监听 IPv4：默认只绑 [::1] 时，浏览器把 localhost 解析成 127.0.0.1 会连不上
    host: '127.0.0.1',
    // 5173 常被其他项目占用，本机固定用 5188
    port: 5188,
    strictPort: true
  }
})
