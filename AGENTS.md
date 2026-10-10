# AGENTS.md

本文件是 @muyianking/hooks 项目的 AI Coding Agent 约束，由通用约束与项目专属约束合并而成；两部分同时生效，冲突时以项目专属约束为准。

## 0. 通用约束

### 修改原则

- 修改文件前先读取并理解现有实现，沿用所在模块的代码风格、命名和技术模式。
- 只做完成用户需求所需的最小修改，不进行无关重构。
- 新增依赖前先检查项目已有依赖、组件、插件和工具；能复用则不引入同类库。
- 不主动创建 README、CI、Docker、测试配置、类型声明或其他非用户要求文件。
- 修改多个关联文件时，保持接口、命名、数据结构和调用链一致。
- 先检查相关文件和既有调用方式，不仅凭文件名或常见框架习惯猜测实现。

### 验证与 Git

- 较大代码修改后运行项目已有的静态检查或测试命令；没有对应脚本时，不假设或自行引入测试框架。
- 默认不执行 Git 提交，除非用户明确要求。
- 用户要求提交时，先检查 git status、git diff 和近期提交风格。
- 不泄露、输出或提交密钥、令牌、内部地址及其他敏感配置。
- 禁止执行 git reset --hard、git clean -f、强制推送等破坏性 Git 操作，除非用户明确要求。

## 项目专属约束

### 项目边界

- 本项目是 Vue 3 Hooks 工具库 @muyianking/hooks（v0.0.4），只提供 Composables 函数与类型，不含页面、组件与样式。
- 技术栈：TypeScript ^5.9.3 + Vue ^3.5.43，纯 ESM（type: module），构建语法目标 ES2021。
- 构建工具固定为 rslib（@rslib/core ^1.0.3），禁止引入 Vite、Webpack、Rollup、Babel 等其他构建工具。
- 包管理器只用 pnpm（pnpm-workspace.yaml 仅保留 pnpm 构建配置，无子包）；禁止用 npm/yarn 安装依赖。
- 运行时依赖只允许 vue，其余工具类依赖一律放 devDependencies。
- 测试只用 vitest + happy-dom，禁止引入 Jest 等其他测试框架；禁止引入原子化 CSS（Tailwind/UnoCSS）、状态管理（Pinia/Vuex）、路由、UI 组件库。
- 格式化由 ESLint 负责（@antfu/eslint-config ^9.5.1，开启 formatters）；禁用 Prettier（prettier.enable: false，formatOnSave: false）。

### 文件落位

- 每个 hook 一个文件，放在 core/ 下，文件名与导出函数同名（useXxx 驼峰）。
- 新增 hook 必须在根目录 index.ts 中以 export * from "./core/xxx.ts" 汇出，并提供 default 与具名双导出，参照 core/useAutoHeightAnimal.ts。
- 单元测试放在 core/**tests**/，文件名 useXxx.test.ts，公共测试工具放同目录 test-utils.ts。
- 文档统一放在 docs/ 下：docs/README.md 为索引文档，每个 hook 一份文档 docs/useXxx.md，文件名与 hook 导出函数同名。
- 新增或修改 hook（参数、返回值、行为变化）结束后，必须同步更新对应的 docs/useXxx.md 与 docs/README.md 索引，保持文档与实现一致。
- 构建、发布等 Node 脚本统一放 script/，不在根目录散落脚本文件。
- 构建产物只输出到 dist/ 并已 gitignore，禁止直接修改 dist/ 下文件。
- CHANGELOG.md 由脚本生成，禁止手工编辑。

### 编码规范

- TypeScript strict 模式；类型引入使用 import type，与值引入分开。
- 模块导入带 .ts 扩展名（tsconfig 开启 allowImportingTsExtensions），与根目录 index.ts 现状保持一致。
- Node 脚本中内置模块使用 node: 前缀（如 node:path、node:process）。
- hook 的 dom 参数同时支持 HTMLElement 实例与 Ref<HTMLElement | null | undefined>，扩展配置用 options 对象；返回状态 ref 与操作方法的组合，沿用 useAutoHeightAnimation 的签名风格。
- 运行时依赖保持只有 vue；防抖等工具函数内联实现，禁止引入 lodash、@vueuse/core。
- 源码注释会原样保留进构建产物（rslib 配置保留全部注释且不 mangle），注释与文档注释使用中文并保持准确。
- 大括号风格 1tbs（来自 @muyianking/config 的 eslint base 规则），规则以 eslint.config.js 为准。

### 构建与发布

- pnpm build：执行 script/build.js，先 rslib build，再拷贝 README.md、LICENSE 并生成精简 package.json 到 dist/。
- pnpm dev：rslib build --watch 模式。
- 发布只走 pnpm release（script/publish.js）：可用 v 参数更新版本 → 生成 CHANGELOG → git commit "release: :package: vX.Y.Z" → 打 tag 并推送；禁止手动执行 npm publish。
- npm 发布由 GitHub Actions（.github/workflows/publish.yml）在 v* tag 推送时自动执行，发布目录为 dist/。
- 升级依赖只用 pnpm update-deps，不手动改版本号。

### 提交与校验

- 提交信息遵循 Conventional Commits（commitlint + cz-git），沿用近期风格 type: :emoji: 描述，如 build: :package:、style: :lipstick:。
- 交互式提交使用 pnpm commit（git add . && git cz）。
- lint-staged 已配置对 *.{js,ts,vue} 执行 eslint --fix，但 .husky/pre-commit 为空文件，提交时不会实际触发。
- 项目没有 lint 脚本；校验与修复改动执行 npx eslint --fix。
- 跑测试执行 pnpm test（vitest run）；新增或修改 hook 时在 core/**tests**/ 补充或更新对应测试。
- NPM_TOKEN 只存在于 GitHub Secrets，禁止写入仓库任何文件。
