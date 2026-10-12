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
practice-app/
├── src/
│   ├── views/                       子页面，按单元分组
│   │   ├── unit-04/                 单元 4 课堂练习（待补充）
│   │   ├── unit-05/                 单元 5 课堂练习
│   │   │   └── StudentList.vue      学生名单多视图（表格 / 卡片 / 名单 / 分组）
│   │   └── unit-06/                 单元 6 课堂练习（待补充）
│   ├── components/                  本模块内共用的小组件
│   ├── assets/                      静态资源
│   ├── App.vue                      根组件，通过注释切换子页面
│   ├── main.js                      入口：注册 Element Plus
│   └── style.css                    全局样式
├── public/
│   ├── unit-04-literal.html         字面量入门对照页（CDN 引入 Vue，独立打开）
│   ├── icons.svg                    iconfont.cn 图标精灵
│   └── images/                      练习用头像与插图
├── index.html
├── vite.config.js
└── package.json
```

模块级的目录约定、练习清单与常见错误定位方向见 `../README.md`（模块二）。

## 待补充

| 位置 | 内容 | 来源 |
| --- | --- | --- |
| `src/views/unit-04/` | `ProfileCard.vue`、`Toggle.vue`、`Activity.vue`、`DirectiveLab.vue`、`directive-lab/`（13 个指令各一个文件） | 模块二文档 |
| `src/views/unit-05/` | 可排序筛选的数据表格、待办清单 CRUD | 模块二文档 |
| `src/views/unit-06/` | 多步预订表单、Markdown 编辑器 | 模块二文档 |
| `src/App.vue` | 改为练习导航入口，用 `practiceList` 表列出全部练习页面 | 模块二文档 |

## 常见问题

### 1. 不要用 `node src/main.js` 直接运行

`main.js` 是 Vite 的源码入口，里面 `import './style.css'`、`.vue` 文件都靠 Vite 转换。
用 Node 直接跑会报 `ERR_UNKNOWN_FILE_EXTENSION: Unknown file extension ".css"`。**必须走 `npm run dev`。**

### 2. 启动后浏览器打不开

开发服务器默认可能只监听 IPv6 的 `[::1]`，而浏览器把 `localhost` 解析成 `127.0.0.1` 就连不上。
本项目已在 `vite.config.js` 固定 `host: '127.0.0.1'`、`port: 5188`（5173 常被其他项目占用），
如仍打不开，直接用 `http://127.0.0.1:5188` 访问。
