import { describe, expect, it, vi } from 'vitest'
import usePageRequest from '../usePageRequest.ts'
import { flushPromises, withSetup } from './test-utils.ts'

describe('usePageRequest', () => {
  it('挂载后自动请求并填充 data', async () => {
    const server = vi.fn().mockResolvedValue({ data: { name: 'mu' } })
    const { result, app } = withSetup(() => usePageRequest(server))

    await flushPromises()

    expect(server).toHaveBeenCalledTimes(1)
    expect(result.data.value).toEqual({ name: 'mu' })
    expect(result.loading.value).toBe(false)

    app.unmount()
  })

  it('manual 时不自动请求，手动调用后填充 data', async () => {
    const server = vi.fn().mockResolvedValue({ data: { name: 'mu' } })
    const { result, app } = withSetup(() => usePageRequest(server, { manual: true }))

    await flushPromises()
    expect(server).not.toHaveBeenCalled()

    await result.request()
    expect(server).toHaveBeenCalledTimes(1)
    expect(result.data.value).toEqual({ name: 'mu' })

    app.unmount()
  })

  it('挂载请求出错时调用 onError', async () => {
    const server = vi.fn().mockRejectedValue(new Error('fail'))
    const onError = vi.fn()
    const { app } = withSetup(() => usePageRequest(server, { onError, errMsg: '自定义错误' }))

    await flushPromises()

    expect(onError).toHaveBeenCalledWith(expect.any(Error), '自定义错误')

    app.unmount()
  })
})
