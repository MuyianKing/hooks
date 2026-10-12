import { describe, expect, it, vi } from 'vitest'
import usePageRequest from '../usePageRequest.ts'
import { flushPromises, withSetup } from './test-utils.ts'

describe('usePageRequest', () => {
  it('挂载后自动请求并填充 data', async () => {
    const server = vi.fn().mockResolvedValue({ data: { name: 'mu' } })
    const { result, app } = withSetup(() => usePageRequest(server))

    await flushPromises()

    expect(server).toHaveBeenCalledTimes(1)
    expect(server).toHaveBeenCalledWith({})
    expect(result.data.value).toEqual({ name: 'mu' })
    expect(result.loading.value).toBe(false)

    app.unmount()
  })

  it('query 初值会随挂载请求一起发出', async () => {
    const server = vi.fn().mockResolvedValue({ data: { name: 'mu' } })
    const { result, app } = withSetup(() => usePageRequest(server, { id: 1 }))

    expect(result.query.value).toEqual({ id: 1 })

    await flushPromises()

    expect(server).toHaveBeenCalledWith({ id: 1 })

    app.unmount()
  })

  it('manual 时不自动请求，手动调用后填充 data', async () => {
    const server = vi.fn().mockResolvedValue({ data: { name: 'mu' } })
    const { result, app } = withSetup(() => usePageRequest(server, undefined, { manual: true }))

    await flushPromises()
    expect(server).not.toHaveBeenCalled()

    await result.request()
    expect(server).toHaveBeenCalledTimes(1)
    expect(result.data.value).toEqual({ name: 'mu' })

    app.unmount()
  })

  it('手动调用时请求会带上 query 的最新值', async () => {
    const server = vi.fn().mockResolvedValue({ data: { name: 'mu' } })
    const { result, app } = withSetup(() => usePageRequest(server, { id: 1 }, { manual: true }))

    await result.request()
    expect(server).toHaveBeenLastCalledWith({ id: 1 })

    result.query.value = { id: 2 }
    await result.request()
    expect(server).toHaveBeenLastCalledWith({ id: 2 })

    app.unmount()
  })

  it('挂载请求出错时调用 onError', async () => {
    const server = vi.fn().mockRejectedValue(new Error('fail'))
    const onError = vi.fn()
    const { app } = withSetup(() => usePageRequest(server, undefined, { onError, errMsg: '自定义错误' }))

    await flushPromises()

    expect(onError).toHaveBeenCalledWith(expect.any(Error), '自定义错误')

    app.unmount()
  })
})
