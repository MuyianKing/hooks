# AGENTS.md

@muyianking/hooks 的 AI Coding Agent 约束：通用约束与项目专属约束同时生效，冲突时以项目专属约束为准。

## 0. 通用约束

### 修改原则

- 修改前先读现有实现，沿用所在模块的风格、命名与技术模式；不凭文件名或框架惯例猜测实现。
- 只做需求所需的最小修改，不做无关重构；改动多个关联文件时保持接口、命名、数据结构与调用链一致。
- 新增依赖前先查已有依赖、组件与工具，能复用就不引入同类库。
- 不主动创建 README、CI、Docker、测试配置、类型声明等非用户要求的文件。

### 验证与 Git

- 较大改动后跑项目已有的检查或测试命令；没有对应脚本时不自行引入测试框架。
- 默认不提交 Git，除非用户明确要求；用户要求时先看 git status、git diff 与近期提交风格。
- 不泄露或提交密钥、令牌、内部地址等敏感配置。
- 禁止 git reset --hard、git clean -f、强制推送等破坏性操作，除非用户明确要求。

## 项目专属约束

### 项目边界

- Vue 3 Hooks 工具库，只提供 Composables 函数与类型，不含页面、组件与样式。
- 技术栈：TypeScript + Vue 3，纯 ESM，构建语法目标 ES2021；依赖版本以 package.json 为准。
- 构建工具只用 rslib，包管理器只用 pnpm（无子包）；禁止引入 Vite、Webpack、Rollup、Babel，禁止用 npm/yarn 安装依赖。
- 运行时依赖只允许 vue，工具类依赖一律放 devDependencies；防抖等工具函数内联实现，禁止 lodash、@vueuse/core。
- 测试只用 vitest + happy-dom；禁止 Jest、原子化 CSS（Tailwind/UnoCSS）、状态管理（Pinia/Vuex）、路由、UI 组件库。
- 格式化由 ESLint 负责（@antfu/eslint-config 开启 formatters，base 规则含 1tbs 大括号风格），禁用 Prettier；规则以 eslint.config.js 为准。

### 文件落位

- 每个 hook 一个文件放 core/，文件名与导出函数同名（useXxx 驼峰），风格参照 core/useAutoHeightAnimal.ts。
- 新增 hook 必须在根目录 index.ts 用 export * from "./core/xxx.ts" 汇出，并提供 default 与具名双导出。
- 测试放 core/__tests__/useXxx.test.ts，公共测试工具放同目录 test-utils.ts。
- 文档放 docs/：docs/README.md 为索引，每个 hook 一份 docs/useXxx.md；改动 hook 的参数、返回值或行为后必须同步更新文档与索引。
- 构建、发布等 Node 脚本放 script/，不在根目录散落脚本。
- 产物只输出到 dist/ 并已 gitignore，禁止直接修改 dist/ 下文件；CHANGELOG.md 由脚本生成，禁止手工编辑。

### 编码规范

- TypeScript strict 模式；类型引入用 import type 并与值引入分开；模块导入带 .ts 扩展名（allowImportingTsExtensions）。
- Node 脚本中内置模块用 node: 前缀（如 node:path、node:process）。
- hook 的 dom 参数同时支持 HTMLElement 实例与 Ref<HTMLElement | null | undefined>，扩展配置用 options 对象，返回状态 ref 与操作方法的组合，签名风格沿用 useAutoHeightAnimation。
- 源码注释会原样保留进构建产物（rslib 保留全部注释且不 mangle），注释与文档注释用中文并保持准确。

### 构建与发布

- pnpm build 执行 script/build.js：rslib build 后拷贝 README.md、LICENSE 并生成精简 package.json 到 dist/；pnpm dev 为 rslib build --watch。
- 发布只走 pnpm release（script/publish.js，可用 v 参数更新版本），禁止手动 npm publish；npm 发布由 GitHub Actions 在 v* tag 推送时自动执行，发布目录 dist/。
- 升级依赖只用 pnpm update-deps，不手动改版本号。

### 提交与校验

- 提交信息遵循 Conventional Commits（commitlint + cz-git），沿用 type: :emoji: 描述风格，如 build: :package:、style: :lipstick:；交互式提交用 pnpm commit。
- 项目没有 lint 脚本，校验与修复改动执行 npx eslint --fix；lint-staged 虽有配置，但 .husky/pre-commit 为空文件，提交时不会触发。
- 跑测试执行 pnpm test（vitest run）；新增或修改 hook 时在 core/__tests__/ 补充或更新对应测试。
- NPM_TOKEN 只存在于 GitHub Secrets，禁止写入仓库任何文件。
