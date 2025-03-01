import { useTitle } from '@vueuse/core'
import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './menu/index'

const router = createRouter({
  history: createWebHashHistory(),
  strict: true,
  routes,
})

router.beforeEach((to) => {
  const title = useTitle()
  if (to.meta.title) {
    title.value = `@muyianking/ui - ${to.meta.title || ''}`
  }

  return true
})

export default router
