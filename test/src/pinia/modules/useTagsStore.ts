import { cloneDeep } from 'lodash-es'
import { defineStore } from 'pinia'

export default defineStore('tags', {
  state: (): {
    tagsList: any[]
  } => ({
    tagsList: [],
  }),
  actions: {
    delTagsItem(index: number) {
      this.tagsList.splice(index, 1)
    },
    setTagsItem(data: any) {
      this.tagsList.push(data)
    },
    clearTags() {
      this.tagsList = []
    },
    closeTagsOther(data: any) {
      this.tagsList = data
    },
  },
  getters: {
    _tags_list(): any[] {
      const index = this.tagsList.findIndex(item => item.path === '/' || item.path === '/home')
      const list = cloneDeep(this.tagsList)

      if (index > 0) {
        const router = list.splice(index, 1)
        if (router && router[0]) {
          list.unshift(router[0])
        }
      }
      return list
    },
  },
})
