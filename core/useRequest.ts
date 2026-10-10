import type { Ref } from 'vue'
import { ref } from 'vue'

interface RequestReturns {
  request: (params?: any) => Promise<any>
  loading: Ref<boolean>
}

/**
 * 普通请求：
 * 1、不返回数据
 * 2、不会立即请求
 * @param server 接口方法
 */
export default function useRequest(server: (params?: any) => Promise<any>): RequestReturns {
  if (!server || typeof server !== 'function') {
    throw new Error('server不是Function')
  }

  const loading = ref(false)

  /**
   * 获取数据
   * @param params 接口参数
   * @returns 接口原始数据
   */
  async function request(params?: any) {
    loading.value = true
    try {
      const data = await server(params)
      return data
    } finally {
      loading.value = false
    }
  }

  return {
    request,
    loading,
  }
}

export {
  useRequest,
}
