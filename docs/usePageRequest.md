# usePageRequest

页面查询：查询条件由泛型约束的 `query`（ref）管理，返回响应式数据，组件挂载后立即请求（可禁止）。

## 引入

```ts
import { usePageRequest } from '@muyianking/hooks'
```

## 类型

```ts
interface UsePageRequestOptions {
  // 禁止挂载后立即执行
  manual?: boolean
  // 请求出错提示信息
  errMsg?: string
  // 请求出错时的回调，不配置默认 console.error
  onError?: (e: unknown, msg: string) => void
}

interface PageRequestReturns<T> {
  // 查询条件（ref 定义，脚本中通过 .value 访问，模板中自动解包）
  query: Ref<T>
  // 请求进行中为 true
  loading: Ref<boolean>
  // 手动触发请求，参数取 query 的最新值
  request: () => Promise<void>
  // 响应式数据
  data: Ref<any>
}

function usePageRequest<T extends Record<string, any> = Record<string, any>>(
  server: (params?: any) => Promise<any>,
  query?: T,
  options?: UsePageRequestOptions,
): PageRequestReturns<T>
```

## 参数


| 参数            | 类型                                | 默认值           | 说明                                      |
| --------------- | ----------------------------------- | ---------------- | ----------------------------------------- |
| server          | `(params?: any) => Promise<any>`    | 必填             | 接口方法                                  |
| query           | `T`                                 | `{}`             | 查询条件初始值，同时决定返回的 query 类型 |
| options.manual  | `boolean`                           | -                | 配置后禁止挂载后立即执行                  |
| options.errMsg  | `string`                            | `'获取数据出错'` | 请求出错提示信息                          |
| options.onError | `(e: unknown, msg: string) => void` | `console.error`  | 请求出错时的回调                          |

## 返回值


| 属性    | 类型                  | 说明                                                                           |
| ------- | --------------------- | ------------------------------------------------------------------------------ |
| query   | `Ref<T>`              | 查询条件（ref 定义，脚本中通过 `.value` 访问，模板中自动解包），类型由泛型决定 |
| loading | `Ref<boolean>`        | 请求进行中为 true                                                              |
| request | `() => Promise<void>` | 手动触发请求，参数取 `query` 的最新值                                          |
| data    | `Ref<any>`            | 响应式数据，初始为 `{}`，请求成功后取接口返回的 `data` 字段（无则为 `{}`）     |

## query 说明

- 查询条件统一放在 `query` 中，初始值取第二个参数 `query`，每次请求读取 `query.value` 的最新值传给 `server`。
- 用泛型约束查询条件类型：`usePageRequest<{ id: number }>(...)`；省略泛型时 `query` 为 `Record<string, any>`。
- 只配置 `options` 时，`query` 位置需用 `undefined` 占位：`usePageRequest(server, undefined, { manual: true })`。
- 修改 `query` 不会自动请求，需要自行调用 `request()`。
- 挂载后自动执行同样读取 `query.value`，`query` 初值会随首次请求一起发出。

## 用法示例

```ts
import { usePageRequest } from '@muyianking/hooks'

const { query, data, loading, request } = usePageRequest<{ id: number }>(
  params => axios.get('/api/detail', { params }),
  { id: 1 },
  { errMsg: '获取详情出错' },
)

// 修改查询条件后手动触发
query.value.id = 2
await request()
```
