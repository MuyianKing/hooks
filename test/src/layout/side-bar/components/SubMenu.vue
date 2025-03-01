<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ElMenuItem, ElSubMenu } from 'element-plus/es'
import 'element-plus/es/components/menu-item/style/css'
import 'element-plus/es/components/sub-menu/style/css'

defineProps({
  menu: {
    type: Object,
    default() {
      return {}
    },
  },
  fatherPath: {
    type: String,
    default: '/',
  },
})

function pathResolve(parentPath: string, path: string) {
  const childPath = path.startsWith('/') || !path ? path : `/${path}`
  return `${parentPath}${childPath}`.replace(/\/\//g, '/').trim()
}
</script>

<template>
  <el-sub-menu v-if="menu.children && menu.children.length > 0" :key="menu.path" :index="pathResolve(fatherPath, menu.path)">
    <template #title>
      <icon v-if="menu.meta?.icon" :icon="menu.meta.icon" class="top-item-icon" />
      <span class="item-title">{{ menu.meta?.title }}</span>
    </template>

    <template v-for="item in menu.children" :key="item.path">
      <sub-menu :menu="item" :father-path="pathResolve(fatherPath, menu.path)" />
    </template>
  </el-sub-menu>
  <el-menu-item v-else-if="menu.meta?.title" :index="pathResolve(fatherPath, menu.path)">
    <icon v-if="menu.meta?.icon" :icon="menu.meta.icon" class="top-item-icon" />
    <span class="item-title">{{ menu.meta.title }}</span>
  </el-menu-item>
</template>

<style lang="scss" scoped>
.top-item-icon {
  width: 25px;
  flex-shrink: 0;
  font-size: 20px !important;
  margin-right: 5px;
}

.item-title {
  height: var(--side-menu-item-height);
  line-height: var(--side-menu-item-height);
  font-size: 13px;
}
</style>
