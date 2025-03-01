<script setup lang="ts">
import SubMenu from '@layout/side-bar/components/SubMenu.vue'
import { ElMenu } from 'element-plus'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import 'element-plus/es/components/menu/style/css'

const route = useRoute()
const onRoutes = computed(() => route.path)

const router = useRouter()
// 菜单
const sideMenu = computed(() => {
  return router.getRoutes().map((item) => {
    return {
      path: item.path,
      meta: item.meta,
    }
  })
})
</script>

<template>
  <div class="anchor-index">
    <el-menu :default-active="onRoutes" class="sidebar-el-menu" router unique-opened>
      <div class="web-name-wrapper">
        <div class="web-name">
          <span class="logo" href="/">
            ui-test
          </span>
        </div>
      </div>
      <template v-for="item in sideMenu" :key="item.path">
        <sub-menu :menu="item" />
      </template>
    </el-menu>
  </div>
</template>

<style lang="scss" scoped>
.anchor-index {
  user-select: none;
  transition: all linear 0.2s;
}

.sidebar-el-menu {
  position: relative;
  height: 100%;
  overflow-y: auto;
  flex-shrink: 0;

  &::-webkit-scrollbar {
    width: 0 !important;
  }
}

.web-name-wrapper {
  height: var(--tab-height);
  display: flex;
  align-items: center;
  padding-left: 20px;
  padding-right: 5px;

  .web-name {
    min-width: 0;
    display: flex;
    align-items: center;
    flex: 1;
    margin-right: 5px;
  }

  .collapse-btn {
    color: var(--side-light-color);
    cursor: pointer;
    margin-left: 5px;
    font-size: 16px !important;
  }

  .logo {
    color: var(--side-light-color);
    font-size: 20px;
    padding-left: 4px;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.sidebar-el-menu:not(.el-menu--collapse) {
  width: 200px;
}

:deep(.el-menu-item) {
  height: var(--side-menu-item-height);

  &:hover {
    color: var(--color-primary);
  }
}

:deep(.el-menu-item.is-active) {
  color: var(--side-light-color);
}

:deep(.el-menu) {
  border-right: 0 !important;
}
</style>
