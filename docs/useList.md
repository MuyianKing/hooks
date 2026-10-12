# useList

列表页逻辑（headless，不含渲染）：管理查询条件与分页参数、搜索添加防抖且每次将分页重置为第 1 页、参数变化自动请求、更新单行数据。

## 引入

```ts
import { useList } from '@muyianking/hooks'
```

## 类型

```ts
interface UseListParams {
  // 查询参数，page/limit 会作为分页参数单独管理并从 query 中移除
  query?: Record<string, any>
  // 请求后台的方法
  server: (params?: any) => Promise<any>
  // 需要额外从接口中获取的字段，默认只取 data 和 count
  data_extend_keys?: string[]
  // 获取数据结束后执行的方法
  onEnd?: () => void
  // mounted 后自动请求数据，默认 true
  autoSearch?: boolean
  // 参数变化后自动请求数据，默认 true
  autoUpdate?: boolean
  // 更新一行数据接口，不配置默认取 server，参数为 oneServerKey
  oneServer?: ((params?: any) => Promise<any>) | null
  // 更新一行数据接口参数 key，默认 id
  oneServerKey?: string
  // 请求或更新数据出错时的回调，不配置默认 console.error
  onError?: (e: unknown, msg: string) => void
}

interface PageQuery {
  page: number
  limit: number
}

interface UseListReturns {
  // 查询条件（ref 定义，脚本中通过 .value 访问，模板中自动解包）
  query: Ref<Record<string, any>>
  // 分页参数
  page_query: PageQuery
  // 获取数据的方法
  getData: (options?: { append?: boolean }) => void
  // 搜索方法：添加防抖且每次会将分页重置为第 1 页
  search: () => void
  // 更新一行数据
  updateOne: (row: Record<string, any>, callback?: (row: Record<string, any>) => void) => void
  // 获取到的数据 {data: 列表数据, count: 数据量}
  table_data: ListData
  loading: Ref<boolean>
}

function useList(params: UseListParams): UseListReturns
```

## 参数

| 参数                    | 类型                                       | 默认值          | 说明                                                                        |
| ----------------------- | ------------------------------------------ | --------------- | --------------------------------------------------------------------------- |
| params.query            | `Record<string, any>`                      | `{}`            | 查询参数；其中 `page`/`limit` 会被剥离出来作为分页参数的初始值              |
| params.server           | `(params?: any) => Promise<any>`           | 必填            | 请求后台的方法                                                              |
| params.data_extend_keys | `string[]`                                 | -               | 需要额外从接口中获取的字段，默认只取 `data` 和 `count`                      |
| params.onEnd            | `() => void`                               | -               | 获取数据结束后执行的方法                                                    |
| params.autoSearch       | `boolean`                                  | `true`          | mounted 后自动请求数据                                                      |
| params.autoUpdate       | `boolean`                                  | `true`          | 参数变化后自动请求数据：query 深度监听变化触发 search，分页变化触发 getData |
| params.oneServer        | `((params?: any) => Promise<any>) \| null` | 取 `server`     | 更新一行数据接口；传 `null` 时 `updateOne` 不执行请求                       |
| params.oneServerKey     | `string`                                   | `'id'`          | 更新一行数据接口的主键参数 key                                              |
| params.onError          | `(e: unknown, msg: string) => void`        | `console.error` | 请求或更新数据出错时的回调                                                  |

## 返回值

| 属性       | 类型                                       | 说明                                                             |
| ---------- | ------------------------------------------ | ---------------------------------------------------------------- |
| query      | `Ref<Record<string, any>>`                 | 响应式查询条件（不含分页字段），脚本中通过 `query.value` 访问    |
| page_query | `{ page: number, limit: number }`          | 响应式分页参数，初始值取 `query.page`/`query.limit`，默认 1 / 20 |
| getData    | `(options?: { append?: boolean }) => void` | 获取数据，内置 300ms 防抖；`append: true` 时将新数据累加到列表   |
| search     | `() => void`                               | 搜索：分页重置为第 1 页后获取数据                                |
| updateOne  | `(row, callback?) => void`                 | 更新一行数据，成功后按主键合并进列表并触发 callback              |
| table_data | `ListData`                                 | 列表数据 `{ data, count, ...额外字段 }`                          |
| loading    | `Ref<boolean>`                             | 请求进行中为 true                                                |

## 用法示例

```ts
import { useList } from '@muyianking/hooks'

const { query, page_query, search, getData, updateOne, table_data, loading } = useList({
  query: { name: '' },
  server: params => axios.get('/api/list', { params }),
  oneServer: params => axios.post('/api/update', params),
})

// 条件搜索：分页重置为第 1 页
search()

// 修改查询条件（脚本中需通过 .value，模板中会自动解包）
query.value.name = '张三'

// 翻页
page_query.page += 1

// 更新一行数据
updateOne({ id: 1 }, (row) => {
  console.log('更新后的行数据', row)
})
```

## updateOne 行为说明

- `row` 中没有主键（`oneServerKey`）时视为新增，直接刷新列表数据。
- 有主键时调用 `oneServer({ [oneServerKey]: row[oneServerKey] })`，接口返回的数据（支持 `{ data: ... }` 包裹）会按主键合并进列表对应行，并触发 `callback`。

## 注意事项

- 依赖 `onMounted` 与 `watch`，需在 setup 中调用。
- query 为 ref 定义，脚本中读写需通过 `query.value`，模板中会自动解包。
- 查询参数与分页参数变化后的自动请求均有 300ms 防抖。
