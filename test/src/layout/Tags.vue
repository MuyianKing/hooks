<script setup lang="ts">
import { Icon } from '@iconify/vue'
import useTagsStore from '@pinia/useTagsStore'
import { ElScrollbar } from 'element-plus'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import 'element-plus/es/components/scrollbar/style/css'

const tags = useTagsStore()
const route = useRoute()
const router = useRouter()
const isActive = (path: string) => path === route.fullPath

const tagsList = computed(() => tags._tags_list)
const showTags = computed(() => tagsList.value.length > 0)

// 关闭单个标签
function closeTags(index: number) {
  const delItem = tagsList.value[index]
  tags.delTagsItem(index)
  // 删除的是当前激活的路由标签
  if (delItem.path === route.path) {
    // 往前后找有没有可替代的路由
    const item = tagsList.value[index] || tagsList.value[index - 1]
    if (item) {
      if (delItem.path === route.fullPath) {
        router.push(item.path)
      }
    } else {
      router.push('/')
    }
  }
}

function iconCloseTags(item: any) {
  closeTags(tagsList.value.findIndex(i => i.path === item.path))
}
</script>

<template>
  <div v-if="showTags" class="tags">
    <el-scrollbar class="flex-1 pr-4 h-full">
      <div class="flex h-full">
        <router-link v-for="(item, index) in tagsList" :key="index" :class="{ active: isActive(item.path) }" :title="item.title" :to="item.path" class="tags-li">
          <span class="tags-li-title">{{ item.title }}</span>
          <icon v-if="tagsList.length > 1" class="tags-close-box" icon="typcn:delete-outline" @click.stop.prevent="iconCloseTags(item)" />
        </router-link>
      </div>
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
.tags {
  position: relative;
  display: flex;
  align-items: center;
  padding-right: 10px;
  user-select: none;
  height: 100%;

  :deep(.el-scrollbar__view) {
    height: 100%;
  }
}

.tags-li {
  flex-shrink: 0;
  height: auto;
  overflow: hidden;
  cursor: pointer;
  background: transparent;
  padding: 5px 10px;
  width: 120px;
  text-align: center;
  color: var(--el-bar-text-color);
  display: flex;
  align-items: center;
  font-size: 14px;

  &:hover {
    .tags-close-box {
      display: block;
    }
  }
}

.tags-li.active {
  color: var(--tab-light-color);
  background-color: var(--bg-color);
}

.tags-li-title {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.tags-close-box {
  display: none;
  margin-left: 5px;
  transition: all 0.3s ease-in;
}

.tags-li.active .tags-li-title {
  color: var(--tab-light-color);
}

.tags-close-box {
  flex-shrink: 0;

  :deep(.el-button) {
    height: 28px;
    line-height: 28px;
  }
}

:deep(.el-scrollbar) {
  height: 28px;
}
</style>
