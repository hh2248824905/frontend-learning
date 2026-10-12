# Vite 脚手架演示

单元 2「包管理与构建工具」的课堂产出：用 Vite 官方脚手架生成一个最小工程，和手写配置做对照。

## 计划

```bash
pnpm create vite vite-scaffold-demo --template vue
cd vite-scaffold-demo
pnpm install
pnpm dev
```

生成后对照下面几项，理解脚手架替你做了什么：

| 关注点 | 官方脚手架 | 手写配置 |
| --- | --- | --- |
| 入口 HTML | 根目录 `index.html` | 同左 |
| 依赖划分 | `dependencies` / `devDependencies` 分开 | 同左 |
| 构建配置 | `vite.config.js` | 手写 |
| 产物目录 | `dist/` | 同左 |
| 环境变量 | `.env` 系列 + `import.meta.env` | 手写 |

## 当前状态

尚未开始，本目录仅占位。单元 3 会把调好的配置（ESLint / Prettier / Stylelint / husky + lint-staged / commitlint / 流水线）沉淀到 `templates/vue3-vite-starter/`。
