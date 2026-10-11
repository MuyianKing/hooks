import type { Ref } from 'vue'
import type { ListData } from './useListRequest.ts'
import { nextTick, onMounted, reactive, ref, watch } from 'vue'
import useListRequest from './useListRequest.ts'

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

/**
 * 简易防抖：delay 毫秒后执行，期间重复调用会重置计时
 */
function debounce<T extends (...args: any[]) => any>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout> | undefined
  return (...args: Parameters<T>) => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

/**
 * 列表页逻辑（headless，不含渲染）：
 * 1、管理查询条件与分页参数
 * 2、搜索添加防抖且每次将分页重置为第 1 页
 * 3、autoUpdate 时参数变化自动请求
 * 4、updateOne 更新单行数据
 * @param params 配置
 * @param params.query 查询需要的参数
 * @param params.server 请求后台的方法
 * @param params.data_extend_keys 需要额外从接口中获取的字段，默认只取 data 和 count
 * @param params.onEnd 获取数据结束后执行的方法
 * @param params.autoSearch mounted 后自动请求数据
 * @param params.autoUpdate 参数变化后自动请求数据
 * @param params.oneServer 更新一行数据接口，如果是 null 则取 server
 * @param params.oneServerKey 更新一行数据接口参数 key，默认 id
 * @param params.onError 请求或更新数据出错时的回调
 */
export default function useList(params: UseListParams): UseListReturns {
  const {
    query = {},
    server,
    data_extend_keys,
    onEnd = null,
    autoSearch = true,
    autoUpdate = true,
    oneServerKey = 'id',
    onError = null,
  } = params

  let oneServer: ((params?: any) => Promise<any>) | null = params.oneServer || server
  if (typeof oneServer !== 'function') {
    oneServer = null
  }

  function handleError(e: unknown, msg: string) {
    if (onError) {
      onError(e, msg)
    } else {
      console.error(e, msg)
    }
  }

  // 条件
  const page_query = reactive<PageQuery>({
    page: query.page || 1,
    limit: query.limit || 20,
  })

  // 删除分页字段
  delete query.page
  delete query.limit

  const query_ref = ref<Record<string, any>>(query)

  const { loading, list_data, getList } = useListRequest(server)

  /**
   * 获取数据
   * @param options 配置
   * @param options.append 是否累加数据
   */
  const getData = debounce(async (options: { append?: boolean } = {}) => {
    try {
      const append = options?.append || false
      await nextTick()
      await getList({
        ...query_ref.value,
        ...page_query,
      }, {
        append,
        data_extend_keys,
      })
    } catch (e) {
      handleError(e, '获取数据出错')
    } finally {
      if (onEnd && typeof onEnd === 'function') {
        onEnd()
      }
    }
  }, 300)

  // 更新一行数据
  function updateOneFun(row: Record<string, any>, callback?: (row: Record<string, any>) => void) {
    if (!oneServer) {
      return
    }

    // 没有主键代表新增：刷新所有数据
    if (!row[oneServerKey]) {
      getData()
      return
    }

    const update_params: Record<string, any> = {}
    update_params[oneServerKey] = row[oneServerKey]

    oneServer(update_params).then((data: any) => {
      if (data?.data) {
        data = Array.isArray(data.data) ? data.data[0] : data.data
      }

      if (!data) {
        handleError(null, '未获取到更新数据')
        return
      }

      // 根据主键找到需要更新的数据项
      const target = list_data.data.find(item => item[oneServerKey] === row[oneServerKey])

      // 列表中不存在对应数据时跳过更新
      if (!target) {
        return
      }

      // 更新数据
      for (const key in target) {
        target[key] = data[key]
      }

      // 回调
      if (callback && typeof callback === 'function') {
        callback(target)
      }
    }).catch((e: unknown) => {
      handleError(e, '更新数据出错')
    })
  }

  // 搜索
  const search = () => {
    page_query.page = 1
    getData()
  }

  if (autoUpdate) {
    // 监听表单参数
    watch(query_ref, () => {
      search()
    }, {
      deep: true,
    })

    // 监听分页参数
    watch(page_query, () => {
      getData()
    })
  }

  onMounted(() => {
    if (autoSearch) {
      search()
    }
  })

  return {
    query: query_ref,
    page_query,
    getData,
    search,
    updateOne: updateOneFun,
    table_data: list_data,
    loading,
  }
}

export {
  useList,
}
