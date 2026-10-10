# useRequest

普通请求封装：不返回数据、不会立即请求，只提供手动触发的方法与 loading 状态。

## 引入

```ts
import { useRequest } from '@muyianking/hooks'
```

## 签名

```ts
function useRequest(server: (params?: any) => Promise<any>): {
  request: (params?: any) => Promise<any>
  loading: Ref<boolean>
}
```

## 参数

| 参数   | 类型                             | 说明                         |
| ------ | -------------------------------- | ---------------------------- |
| server | `(params?: any) => Promise<any>` | 接口方法，不是函数时抛出错误 |

## 返回值

| 属性    | 类型                             | 说明                           |
| ------- | -------------------------------- | ------------------------------ |
| request | `(params?: any) => Promise<any>` | 手动触发请求，返回接口原始数据 |
| loading | `Ref<boolean>`                   | 请求进行中为 true              |

## 用法示例

```ts
import { useRequest } from '@muyianking/hooks'

const { request, loading } = useRequest(
  params => axios.post('/api/save', params),
)

async function save() {
  const data = await request({ name: 'muyian' })
}
```
