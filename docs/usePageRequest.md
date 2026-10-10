# usePageRequest

页面查询：返回响应式数据，组件挂载后立即请求（可禁止）。

## 引入

```ts
import { usePageRequest } from '@muyianking/hooks'
```

## 签名

```ts
function usePageRequest(
  server: (params?: any) => Promise<any>,
  options?: {
    // 禁止挂载后立即执行
    manual?: boolean
    // 请求出错提示信息
    errMsg?: string
    // 请求出错时的回调，不配置默认 console.error
    onError?: (e: unknown, msg: string) => void
  }
): {
  loading: Ref<boolean>
  request: () => Promise<void>
  data: Ref<any>
}
```

## 参数

| 参数            | 类型                                | 默认值           | 说明                     |
| --------------- | ----------------------------------- | ---------------- | ------------------------ |
| server          | `(params?: any) => Promise<any>`    | 必填             | 接口方法                 |
| options.manual  | `boolean`                           | -                | 配置后禁止挂载后立即执行 |
| options.errMsg  | `string`                            | `'获取数据出错'` | 请求出错提示信息         |
| options.onError | `(e: unknown, msg: string) => void` | `console.error`  | 请求出错时的回调         |

## 返回值

| 属性    | 类型                  | 说明                                                                       |
| ------- | --------------------- | -------------------------------------------------------------------------- |
| loading | `Ref<boolean>`        | 请求进行中为 true                                                          |
| request | `() => Promise<void>` | 手动触发请求                                                               |
| data    | `Ref<any>`            | 响应式数据，初始为 `[]`，请求成功后取接口返回的 `data` 字段（无则为 `{}`） |

## 用法示例

```ts
import { usePageRequest } from '@muyianking/hooks'

const { data, loading, request } = usePageRequest(
  params => axios.get('/api/detail', { params }),
  { errMsg: '获取详情出错' },
)
```
