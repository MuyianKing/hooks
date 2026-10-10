# @muyianking/hooks 文档

Vue 3 Hooks 工具库，只提供 Composables 函数与类型。每个 hook 一份文档，本文件为索引。

## 安装

```bash
pnpm i @muyianking/hooks
```

## Hooks

| Hook                   | 说明                                                | 文档                                                     |
| ---------------------- | --------------------------------------------------- | -------------------------------------------------------- |
| useAutoHeightAnimation | 使高度自适应的区域也能拥有展开收起的动画            | [useAutoHeightAnimation.md](./useAutoHeightAnimation.md) |
| useList                | 列表页逻辑：查询条件、分页、防抖搜索、更新单行      | [useList.md](./useList.md)                               |
| useListRequest         | 分页列表查询：loading、列表数据、数据累加、自动序号 | [useListRequest.md](./useListRequest.md)                 |
| usePageRequest         | 页面查询：响应式数据、挂载后自动执行                | [usePageRequest.md](./usePageRequest.md)                 |
| useRequest             | 普通请求：手动触发、loading 状态                    | [useRequest.md](./useRequest.md)                         |

## 约定

- 所有 hook 均支持具名导入：`import { useXxx } from '@muyianking/hooks'`。
- 请求类 hook 的 `server` 参数统一为返回 `Promise` 的接口方法。
