# uniapp-port · 跨端拓展

把 `campus-activity-admin/` 的管理端移植到 uni-app，编译到小程序 / H5 / App 端。

## 计划

| 步骤 | 说明 |
| --- | --- |
| 1 | 梳理可复用逻辑：`api/`、`stores/`、`composables/` 基本可平移 |
| 2 | 处理差异：Element Plus 组件在 uni-app 中不可用，需换成 uni-ui 或自研 |
| 3 | 路由差异：Vue Router 换成 uni-app 页面栈 |
| 4 | 条件编译：用 `#ifdef` / `#ifndef` 处理各端差异 |
| 5 | 打包验证：至少跑通一个目标端 |

> 本目录目前是占位，属于拓展内容，随课程进度决定是否落地。
