import { describe, expect, it, vi } from 'vitest'
import useRequest from '../useRequest.ts'

describe('useRequest', () => {
  it('server 不是函数时抛出错误', () => {
    expect(() => useRequest(null as any)).toThrow('server不是Function')
  })

  it('request 返回接口数据且 loading 正确切换', async () => {
    const server = vi.fn().mockResolvedValue({ data: 1 })
    const { request, loading } = useRequest(server)

    expect(loading.value).toBe(false)

    const promise = request({ a: 1 })
    expect(loading.value).toBe(true)

    const data = await promise
    expect(data).toEqual({ data: 1 })
    expect(loading.value).toBe(false)
    expect(server).toHaveBeenCalledWith({ a: 1 })
  })

  it('请求失败时 loading 也会复位并抛出错误', async () => {
    const server = vi.fn().mockRejectedValue(new Error('fail'))
    const { request, loading } = useRequest(server)

    await expect(request()).rejects.toThrow('fail')
    expect(loading.value).toBe(false)
  })
})
