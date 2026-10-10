# useListRequest

分页列表查询：管理 loading 与列表数据，支持数据累加、额外字段获取与自动序号生成。`useList` 的底层实现，也可单独使用。

## 引入

```ts
import { useListRequest } from '@muyianking/hooks'
```

## 签名

```ts
function useListRequest(server: (params?: any) => Promise<any>): {
  loading: Ref<boolean>
  list_data: ListData
  getList: (
    // 分页参数 page/limit 与查询参数，会整体传给 server
    params: { page: number, limit: number } & Record<string, any>,
    options?: {
      // 是否将当前从接口中获取的数据累加到 data 中
      append?: boolean
      // 需要额外从接口中获取的字段
      data_extend_keys?: string[]
    }
  ) => Promise<void>
}

interface ListData {
  // 数据总量
  count: number
  // 列表数据
  data: any[]
  // data_extend_keys 中配置的额外字段
  [key: string]: any
}
```

## 参数

| 参数   | 类型                             | 说明     |
| ------ | -------------------------------- | -------- |
| server | `(params?: any) => Promise<any>` | 接口方法 |

## 返回值

| 属性      | 类型                                  | 说明                                                    |
| --------- | ------------------------------------- | ------------------------------------------------------- |
| loading   | `Ref<boolean>`                        | 请求进行中为 true（请求结束后在 nextTick 中置为 false） |
| list_data | `ListData`                            | 响应式列表数据                                          |
| getList   | `(params, options?) => Promise<void>` | 获取数据                                                |

## getList 说明

- `params` 会整体传给 `server`，通常包含 `page`、`limit` 与查询条件。
- 自动为每个对象数据项生成序号 `index`：`limit * (page - 1) + index + 1`。
- `options.append` 为 `true` 时将本次数据累加到 `data`，否则整体替换。
- `options.data_extend_keys` 中配置的字段会从接口返回值复制到 `list_data`。
- 接口未返回 `data` 字段时跳过本次数据处理（loading 仍会正常结束）。

## 用法示例

```ts
import { useListRequest } from '@muyianking/hooks'

const { loading, list_data, getList } = useListRequest(
  params => axios.get('/api/list', { params }),
)

await getList(
  { page: 1, limit: 20, name: 'muyian' },
  { append: false, data_extend_keys: ['summary'] },
)
```
