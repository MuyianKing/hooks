<script setup lang="ts">
defineProps({
  label: {
    type: String,
    required: true,
  },
  labelWidth: {
    type: String,
    default: '80px',
  },
})
</script>

<template>
  <div class="wrapper">
    <div class="block-title">
      {{ label }}
    </div>
    <slot />
  </div>
</template>

<style lang='scss' scoped>
.wrapper {
  @apply flex items-center mt-4;

  &:first-child {
    @apply mt-0;
  }
}

.block-title {
  @apply mb-1 flex-shrink-0 mr-2;
  width: v-bind(labelWidth);
}
</style>
