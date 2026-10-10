import type { App } from 'vue'
import { createApp } from 'vue'

/**
 * 在组件 setup 上下文中执行 composable，让 onMounted、watch 等与组件生命周期相关的逻辑生效
 * @param composable 要执行的组合式函数
 */
export function withSetup<T>(composable: () => T): { result: T, app: App } {
  let result!: T
  const app = createApp({
    // 仅提供挂载上下文，渲染空内容
    setup() {
      result = composable()
      return () => ''
    },
  })
  app.mount(document.createElement('div'))
  return { result, app }
}

/**
 * 等待全部微任务与定时器回调执行完成（仅限真实定时器环境使用）
 */
export function flushPromises() {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, 0)
  })
}
