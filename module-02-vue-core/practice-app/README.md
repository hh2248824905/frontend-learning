# practice-app

模块二「Vue 3 核心基础」的课堂练习工程（Vue 3 + Vite + Element Plus，JavaScript）。

> 位置：`module-02-vue-core/practice-app/`，对应课程第 4-6 周（单元 4-6）。
> 模块三、模块四的练习工程为同构副本，分别位于 `module-03-components/practice-app/`、`module-04-architecture/practice-app/`。

## 快速开始

```sh
npm install       # 安装依赖
npm run dev       # 开发服务器 http://127.0.0.1:5188
npm run build     # 构建到 dist/
npm run preview   # 预览构建产物
```

## 技术栈

- Vue 3（组合式 API / `<script setup>`）
- Vite 8
- Element Plus（UI 组件库）
- 图标：iconfont.cn（见 `public/icons.svg`，用 `<svg><use href="/icons.svg#图标名" /></svg>` 引用）

## 目录结构

```
src/
├── main.js                        # 入口：注册 Element Plus
├── App.vue                        # 根组件，通过注释切换子页面
├── style.css                      # 全局样式
├── assets/                        # 静态资源
└── views/                         # 子页面，按单元分组
    ├── unit-04/                   # 单元 4：模板语法与响应式基础
    │   └── vue-literal-cdn.html   # CDN 版字面量入门页（免构建，直接浏览器打开）
    └── unit-05/                   # 单元 5：计算属性、侦听器与渲染控制
        └── StudentList.vue        # 学生名单多视图（表格 / 卡片 / 名单 / 分组）
```

## 常见问题

### 1. 不要用 `node src/main.js` 直接运行

`main.js` 是 Vite 的源码入口，里面 `import './style.css'`、`.vue` 文件都靠 Vite 转换。
用 Node 直接跑会报 `ERR_UNKNOWN_FILE_EXTENSION: Unknown file extension ".css"`。**必须走 `npm run dev`。**

### 2. 启动后浏览器打不开

开发服务器默认可能只监听 IPv6 的 `[::1]`，而浏览器把 `localhost` 解析成 `127.0.0.1` 就连不上。
本项目已在 `vite.config.js` 固定 `host: '127.0.0.1'`、`port: 5188`（5173 常被其他项目占用），
如仍打不开，直接用 `http://127.0.0.1:5188` 访问。
