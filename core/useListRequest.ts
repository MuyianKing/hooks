import type { Ref } from 'vue'
import { nextTick, reactive, ref } from 'vue'

export interface ListData {
  // 数据总量
  count: number
  // 列表数据
  data: any[]
  // data_extend_keys 中配置的额外字段
  [key: string]: any
}

interface GetListOptions {
  // 是否将当前从接口中获取的数据累加到 data 中
  append?: boolean
  // 默认 data 中只会包含 data 和 count，这里配置需要获取的接口中的其他字段
  data_extend_keys?: string[]
}

interface ListRequestReturns {
  loading: Ref<boolean>
  list_data: ListData
  getList: (params: { page: number, limit: number } & Record<string, any>, options?: GetListOptions) => Promise<void>
}

/**
 * 分页列表查询
 * @param server 接口方法
 */
export default function useListRequest(server: (params?: any) => Promise<any>): ListRequestReturns {
  const loading = ref(false)
  const list_data = reactive<ListData>({
    count: 0,
    data: [],
  })

  /**
   * 获取数据
   * @param params 分页参数 page/limit 与查询参数
   * @param options 配置
   * @param options.append 是否将当前从接口中获取的数据累加到 data 中
   * @param options.data_extend_keys 需要额外从接口中获取的字段
   */
  async function getList(params: { page: number, limit: number } & Record<string, any>, options: GetListOptions = {}) {
    const append = options.append || false
    const data_extend_keys = options.data_extend_keys || []

    try {
      loading.value = true
      await nextTick()
      const data = await server(params)

      if (!data.data) {
        return
      }

      // 生成序号
      data.data.forEach((item: any, index: number) => {
        if (typeof item === 'object') {
          item.index = params.limit * (params.page - 1) + index + 1
        }
      })

      // 累加
      if (append) {
        data.data.forEach((item: any) => {
          list_data.data.push(item)
        })
      } else {
        list_data.data = data.data
      }

      // 额外字段
      data_extend_keys.forEach((key) => {
        if (data[key] !== undefined) {
          list_data[key] = data[key]
        }
      })

      list_data.count = data.count
    } finally {
      nextTick(() => {
        loading.value = false
      })
    }
  }

  return {
    loading,
    list_data,
    getList,
  }
}

export {
  useListRequest,
}
