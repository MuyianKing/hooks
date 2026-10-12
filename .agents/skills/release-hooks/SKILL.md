---
name: release-hooks
description: 按本仓库约定发布 @muyianking/hooks 新版本（走 pnpm release 脚本）。当用户说「发布 x.y.z」「发版」「release 一个新版本」「publish 上线」等时使用；包含发布前预检、参数写法、非交互执行方式、发布后校验与已知坑。只要涉及发版本号就应触发，即使没提 release。
---

# 发布 @muyianking/hooks

按下面的步骤直接执行。预检通过就发布，不要反复权衡或向用户确认已经写明的事；只有预检失败或遇到本文没写过的新情况，才停下来深入排查。

## 铁律

- 发布只走 `pnpm release`（`script/publish.js`）。禁止手动 `npm publish`，也不要手搓发布步骤（手动改版本、手动 tag、手动 push），脚本出问题就先修脚本或报告。
- 版本参数必须写成 `v=X.Y.Z`。`getParams()` 是按 `=` 切分 `process.argv` 的，写成 `vX.Y.Z` 不会更新版本号，会拿当前版本去提交、最后卡在 tag 已存在。
- 脚本内部有 `git add .`，工作区里任何未提交改动都会被卷进 release 提交。发布前把无关改动单独提交掉，让 release 提交只含 `package.json` + `CHANGELOG.md`（仓库既有惯例）。

## 步骤

### 1. 处理未提交改动

`git status --short`。有改动就单独提交（feat / fix / chore / docs 等），不要留给发布脚本。

### 2. 只读预检（不改任何状态）

```bash
git status --short                                    # 应为空
git log --oneline -3
git tag --sort=-v:refname | head -3                   # 确认新 tag 还不存在
node -p "require('./package.json').version"           # 当前版本
git ls-remote origin refs/heads/main                  # 远端 main 与本地 HEAD 一致
GIT_TERMINAL_PROMPT=0 git push --dry-run origin main  # 推送权限（Everything up-to-date）
```

### 3. 执行发布

脚本第一步是 inquirer 交互确认（问「您确定切换到主分支并合并了最新的代码？」），非 TTY 环境用管道喂 `y`。第 2 步的检查就是它要问的那个前提，核过再喂。

```bash
printf 'y\n' | pnpm release v=X.Y.Z
```

脚本依次做：写 `package.json` 版本 → `pnpm log` 生成 CHANGELOG → `git add .` → `git commit -m "release: :package: vX.Y.Z"` → `git push && git tag vX.Y.Z && git push origin vX.Y.Z`。

### 4. 校验

```bash
git log --oneline -3                              # 顶部是 release: :package: vX.Y.Z
git status --short                                # 应干净
git ls-remote --tags origin | grep vX.Y.Z         # tag 已推到远端
head -14 CHANGELOG.md                             # 看一下本次条目是否合理
```

### 5. 收尾说明

npm 发布由 GitHub Actions 自动完成（`.github/workflows/publish.yml`，`on: push tags: v*`）。会话里通常没有 `gh`，看不到 CI 状态，直接告诉用户去仓库 Actions 页确认这次 `npm publish`，并以 npm 上的 `@muyianking/hooks@X.Y.Z` 为准。

## 已知坑

- **CHANGELOG 是按提交信息生成的**。如果特性改动被并进一个标题不相关的提交（例如 `fix: 优化usePageList` 里夹带了 usePageRequest 的改动），release notes 就不会体现这个特性。所以特性改动要单独提交，发布前顺手看一眼 `CHANGELOG.md` 顶部对不对——不对就只能事后改 GitHub Release 说明。
- **本机 `pnpm build` 可能失败**，报 `C:\Program Files\nodejs\node_modules\pnpm\pnpm` 找不到。这是本地 pnpm 路径解析问题，只影响本地打包；CI 是 ubuntu 不受影响，不要因此判定发布失败。
- **环境噪声不要当仓库问题**：本 shell 里 `pnpm` 偶发 `command not found`（改用 `npx <等价命令>`），`git fetch` 偶发失败（改用 `git ls-remote` 探测远端）。
- **`pnpm commit` 需要 commitizen**（devDependencies 里已有）。`cz-git` 只是 commitizen 的适配器、自身没有 bin，只装 cz-git 会报 `git: 'cz' is not a git command`。
- **不要为了"更稳妥"自创流程**：例如绕过脚本手动打 tag、或把 release 提交拆成多个。用户要的是照本文执行。
