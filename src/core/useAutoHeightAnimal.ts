import type { Ref } from 'vue'
import { ref, watch } from 'vue'

interface Options {
  init?: boolean
  activeClass?: string
  inactiveClass?: string
}

/**
 * 使高度自适应的区域也能拥有展开收起的动画
 * @param dom 操作的区域dom或dom的Ref对象
 * @param options 配置
 * @param options.init status的初始值
 * @param options.activeClass 展开时希望添加的类名
 * @param options.inactiveClass 收起时希望添加的类名
 */
export default function useAutoHeightAnimation(dom: HTMLElement | Ref<HTMLElement>, options?: Options) {
  let real_dom: HTMLElement

  // 展开收起状态
  const status = ref(options?.init === undefined ? true : options.init)

  function handler() {
    // 展开
    if (status.value) {
      real_dom.style.height = 'auto'
      const { height } = real_dom.getBoundingClientRect()
      real_dom.style.height = '0'
      real_dom.getBoundingClientRect()
      real_dom.style.height = `${height}px`

      // 添加展开样式
      options?.activeClass && real_dom.classList.add(options?.activeClass)
      options?.inactiveClass && real_dom.classList.remove(options?.inactiveClass)
    } else {
      // 收起
      const { height } = real_dom.getBoundingClientRect()
      real_dom.style.height = `${height}px`
      real_dom.getBoundingClientRect()
      real_dom.style.height = '0'
      options?.activeClass && real_dom.classList.remove(options?.activeClass)
      // 添加收起样式
      options?.inactiveClass && real_dom.classList.add(options?.inactiveClass)
    }
  }

  // 开启监听
  function startWatch() {
    handler()
    watch(status, handler)
  }

  // 直接开启监听
  if (dom instanceof HTMLElement) {
    real_dom = dom
    startWatch()
  } else {
    // 要等待dom挂在后才能开启监听
    watch(dom, (val) => {
      if (val) {
        real_dom = val
        startWatch()
      }
    }, {
      once: true,
    })
  }

  return {
    status,
    toggle() {
      status.value = !status.value
    },
  }
}

export {
  useAutoHeightAnimation
}