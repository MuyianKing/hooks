import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import useListRequest from '../useListRequest.ts'

describe('useListRequest', () => {
  it('getList 填充 data 与 count 并生成分页序号', async () => {
    const server = vi.fn().mockResolvedValue({
      count: 12,
      data: [{ id: 1 }, { id: 2 }, { id: 3 }],
    })
    const { getList, list_data, loading } = useListRequest(server)

    const promise = getList({ page: 2, limit: 10 })
    expect(loading.value).toBe(true)

    await promise
    await nextTick()

    expect(loading.value).toBe(false)
    expect(list_data.data).toEqual([
      { id: 1, index: 11 },
      { id: 2, index: 12 },
      { id: 3, index: 13 },
    ])
    expect(list_data.count).toBe(12)
  })

  it('append 模式将数据累加到已有列表', async () => {
    const server = vi.fn()
      .mockResolvedValueOnce({ count: 2, data: [{ id: 1 }] })
      .mockResolvedValueOnce({ count: 2, data: [{ id: 2 }] })
    const { getList, list_data } = useListRequest(server)

    await getList({ page: 1, limit: 10 })
    await getList({ page: 2, limit: 10 }, { append: true })
    await nextTick()

    expect(list_data.data).toEqual([
      { id: 1, index: 1 },
      { id: 2, index: 11 },
    ])
  })

  it('data_extend_keys 拷贝接口额外字段', async () => {
    const server = vi.fn().mockResolvedValue({
      count: 1,
      data: [{ id: 1 }],
      total_money: 100,
    })
    const { getList, list_data } = useListRequest(server)

    await getList({ page: 1, limit: 10 }, { data_extend_keys: ['total_money'] })

    expect(list_data.total_money).toBe(100)
  })

  it('接口没有 data 字段时不更新列表且 loading 复位', async () => {
    const server = vi.fn().mockResolvedValue({ msg: 'error' })
    const { getList, list_data, loading } = useListRequest(server)

    await getList({ page: 1, limit: 10 })
    await nextTick()

    expect(list_data.data).toEqual([])
    expect(list_data.count).toBe(0)
    expect(loading.value).toBe(false)
  })
})
