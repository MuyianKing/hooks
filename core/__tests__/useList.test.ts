import { afterEach, describe, expect, it, vi } from 'vitest'
import useList from '../useList.ts'
import { flushPromises, withSetup } from './test-utils.ts'

describe('useList', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('mounted 后自动查询并填充 table_data', async () => {
    vi.useFakeTimers()
    const server = vi.fn().mockResolvedValue({ count: 1, data: [{ id: 1 }] })
    const onEnd = vi.fn()
    const { result, app } = withSetup(() => useList({ server, onEnd }))

    // mounted 后的首次查询经 300ms 防抖
    await vi.advanceTimersByTimeAsync(300)

    expect(server).toHaveBeenCalledTimes(1)
    expect(result.table_data.data).toEqual([{ id: 1, index: 1 }])
    expect(result.table_data.count).toBe(1)
    expect(onEnd).toHaveBeenCalledTimes(1)

    app.unmount()
  })

  it('query 变化后自动重新查询', async () => {
    vi.useFakeTimers()
    const server = vi.fn().mockResolvedValue({ count: 0, data: [] })
    const { result, app } = withSetup(() => useList({ server, query: { name: 'a' } }))

    await vi.advanceTimersByTimeAsync(300)
    expect(server).toHaveBeenCalledTimes(1)

    result.query.name = 'b'
    await vi.advanceTimersByTimeAsync(300)

    expect(server).toHaveBeenCalledTimes(2)
    expect(server).toHaveBeenLastCalledWith(expect.objectContaining({ name: 'b', page: 1 }))

    app.unmount()
  })

  it('分页变化后自动重新查询，search 会重置页码且防抖合并', async () => {
    vi.useFakeTimers()
    const server = vi.fn().mockResolvedValue({ count: 0, data: [] })
    const { result, app } = withSetup(() => useList({ server }))

    await vi.advanceTimersByTimeAsync(300)
    expect(server).toHaveBeenCalledTimes(1)

    result.page_query.page = 3
    await vi.advanceTimersByTimeAsync(300)
    expect(server).toHaveBeenCalledTimes(2)

    result.search()
    expect(result.page_query.page).toBe(1)
    await vi.advanceTimersByTimeAsync(300)
    // search 与 page_query 的 watch 触发被防抖合并为一次请求
    expect(server).toHaveBeenCalledTimes(3)
    expect(server).toHaveBeenLastCalledWith(expect.objectContaining({ page: 1 }))

    app.unmount()
  })

  it('updateOne 按主键更新对应行数据', async () => {
    const server = vi.fn()
    const oneServer = vi.fn().mockResolvedValue({ data: { id: 1, name: 'b' } })
    const { result, app } = withSetup(() => useList({ server, oneServer, autoSearch: false }))

    result.table_data.data.push({ id: 1, name: 'a' })

    const callback = vi.fn()
    result.updateOne({ id: 1 }, callback)
    await flushPromises()

    expect(oneServer).toHaveBeenCalledWith({ id: 1 })
    expect(result.table_data.data[0].name).toBe('b')
    expect(callback).toHaveBeenCalledWith(result.table_data.data[0])

    app.unmount()
  })

  it('updateOne 无主键时刷新列表而不调用 oneServer', async () => {
    vi.useFakeTimers()
    const server = vi.fn().mockResolvedValue({ count: 0, data: [] })
    const oneServer = vi.fn()
    const { result, app } = withSetup(() => useList({ server, oneServer, autoSearch: false }))

    result.updateOne({ name: 'new' })
    await vi.advanceTimersByTimeAsync(300)

    expect(oneServer).not.toHaveBeenCalled()
    expect(server).toHaveBeenCalledTimes(1)

    app.unmount()
  })

  it('请求出错时调用 onError', async () => {
    vi.useFakeTimers()
    const server = vi.fn().mockRejectedValue(new Error('boom'))
    const onError = vi.fn()
    const { app } = withSetup(() => useList({ server, onError }))

    await vi.advanceTimersByTimeAsync(300)

    expect(onError).toHaveBeenCalledWith(expect.any(Error), '获取数据出错')

    app.unmount()
  })
})
