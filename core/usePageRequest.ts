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

interface PageRequestReturns {
  loading: Ref<boolean>
  request: () => Promise<void>
  data: Ref<any>
}

/**
 * 页面查询
 * 1、返回的数据是响应式的
 * 2、组件挂载后立即执行：可传入 manual=true 时禁止
 * @param server 接口方法
 * @param options 配置
 * @param options.manual 禁止立即执行
 * @param options.errMsg 请求出错提示信息
 * @param options.onError 请求出错时的回调
 */
export default function usePageRequest(server: (params?: any) => Promise<any>, options?: UsePageRequestOptions): PageRequestReturns {
  const { manual, errMsg, onError } = options || {}

  const { request, loading } = useRequest(server)

  // 响应式数据
  const _data = ref<any>([])

  function handleError(e: unknown) {
    const msg = errMsg || '获取数据出错'
    if (onError) {
      onError(e, msg)
    } else {
      console.error(e, msg)
    }
  }

  async function _request() {
    const data = await request()
    _data.value = data?.data || {}
  }

  // 是否需要页面挂载后立即执行
  if (!manual) {
    onMounted(() => {
      _request().catch(handleError)
    })
  }

  return {
    loading,
    request: _request,
    data: _data,
  }
}

export {
  usePageRequest,
}
