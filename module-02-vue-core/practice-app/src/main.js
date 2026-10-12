import { createApp } from 'vue'
// ① 引入 Element Plus 组件库与其样式（安装后必须在这里引入才会生效）
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './style.css'
import App from './App.vue'

createApp(App).use(ElementPlus).mount('#app')
