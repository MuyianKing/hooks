import type { Ref } from 'vue'
import { onMounted, ref } from 'vue'
import useRequest from './useRequest.ts'

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
  loading: Ref<boolean>
  request: () => Promise<void>
  data: Ref<any>
}

/**
 * 页面查询
 * 1、返回的数据是响应式的
 * 2、组件挂载后立即执行：可传入 manual=true 时禁止
 * 3、查询条件通过 query（ref）管理，初始值取第二个参数 query，每次请求读取其最新值
 * @param server 接口方法
 * @param query 查询条件初始值
 * @param options 配置
 * @param options.manual 禁止立即执行
 * @param options.errMsg 请求出错提示信息
 * @param options.onError 请求出错时的回调
 */
export default function usePageRequest<T extends Record<string, any> = Record<string, any>>(server: (params?: any) => Promise<any>, query?: T, options?: UsePageRequestOptions): PageRequestReturns<T> {
  const { manual, errMsg, onError } = options || {}

  const { request, loading } = useRequest(server)

  // 查询条件
  const _query = ref<any>(query ?? {})

  // 响应式数据
  const _data = ref<any>({})

  function handleError(e: unknown) {
    const msg = errMsg || '获取数据出错'
    if (onError) {
      onError(e, msg)
    } else {
      console.error(e, msg)
    }
  }

  async function _request() {
    const data = await request(_query.value)
    _data.value = data?.data || {}
  }

  // 是否需要页面挂载后立即执行
  if (!manual) {
    onMounted(() => {
      _request().catch(handleError)
    })
  }

  return {
    query: _query,
    loading,
    request: _request,
    data: _data,
  }
}

export {
  usePageRequest,
}
