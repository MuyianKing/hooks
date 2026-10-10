# useAutoHeightAnimation

使高度自适应（height: auto）的区域也能拥有展开收起的过渡动画。

## 引入

```ts
import { useAutoHeightAnimation } from '@muyianking/hooks'
```

## 签名

```ts
function useAutoHeightAnimation(
  dom: HTMLElement | Ref<HTMLElement | undefined | null>,
  options?: {
    // status的初始值
    init?: boolean
  }
): {
  // true-展开  false-收起
  status: Ref<boolean>
  // 切换展开收起的方法
  toggle: () => void
}
```

## 参数

| 参数         | 类型                                                   | 默认值 | 说明                                     |
| ------------ | ------------------------------------------------------ | ------ | ---------------------------------------- |
| dom          | `HTMLElement \| Ref<HTMLElement \| null \| undefined>` | 必填   | 操作的区域 dom 或 dom 的 Ref 对象        |
| options.init | `boolean`                                              | `true` | status 的初始值（true-展开，false-收起） |

## 返回值

| 属性   | 类型           | 说明                                |
| ------ | -------------- | ----------------------------------- |
| status | `Ref<boolean>` | 展开收起状态，true-展开，false-收起 |
| toggle | `() => void`   | 切换展开收起的方法                  |

## 用法示例

```vue
<script setup lang="ts">
import { useAutoHeightAnimation } from '@muyianking/hooks'
import { ref } from 'vue'

const box = ref<HTMLElement | null>(null)

const { status, toggle } = useAutoHeightAnimation(box)
</script>

<template>
  <button @click="toggle()">
    {{ status ? '收起' : '展开' }}
  </button>

  <div ref="box" class="box">
    高度自适应的内容...
  </div>
</template>

<style scoped>
.box {
  overflow: hidden;
  transition: height 0.3s;
}
</style>
```

## 注意事项

- 传入 Ref 时需在 setup 中调用，dom 挂载后自动开启监听；传入 HTMLElement 实例则立即生效。
- 动画通过修改内联 `style.height` 实现，元素需设置 `transition: height` 与 `overflow: hidden` 才能看到过渡效果。
- 展开后元素高度会被固定为测量值（px），内容后续变化不会自动重新计算，再次切换时会重新测量。
