# vue3-vite-starter

Vue 3 + Vite 工程模板，单元 3 的产出，后续所有练习与实训工程都从这里复制起步。

## 目录约定

```
vue3-vite-starter/
├── src/
│   ├── main.js
│   ├── App.vue
│   ├── assets/
│   ├── components/
│   ├── composables/
│   ├── views/
│   ├── router/
│   ├── stores/
│   └── api/
├── public/
├── vite.config.js
├── .eslintrc / eslint.config.js
├── .prettierrc
├── .stylelintrc
└── .husky/pre-commit          # 提交前自动跑 ESLint + Prettier
```

## 待补充清单

- [ ] Vite 构建配置：别名 `@` 指向 `src`、开发服务器固定 host 与端口、接口代理
- [ ] ESLint + Prettier 配置与脚本（`lint`、`format`）
- [ ] Stylelint 配置（样式文件规范）
- [ ] Husky + lint-staged 提交钩子
- [ ] 流水线配置（提交 / 合并请求时自动跑检查）
- [ ] 模板自带 README 与 `.env` 示例

> 本目录目前是占位。填充完成后，这里应当能在干净环境一键跑通。
