<script setup lang="ts">
import { useAutoHeightAnimation } from '@muyianking/_hooks'
import { useTemplateRef } from 'vue'

const body_ref = useTemplateRef('body_ref')
const { toggle, status } = useAutoHeightAnimation(body_ref, {
  init: false,
})
</script>

<template>
  <div class="p-4">
    <ElButton type="primary" class="mb-4" @click="toggle">
      {{ status ? '收起' : "展开" }}
    </ElButton>
    <div ref="body_ref" class="auto-wrapper">
      <div class="p-4">
        <div v-for="item in 10" :key="item">
          hello
        </div>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.auto-wrapper {
  @apply bg-white rounded;
  height: auto;
  overflow-y: hidden;
  transition: all ease 0.5s;
}

.inexpand-item {
  padding: 0;
}
</style>
