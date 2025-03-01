<script setup lang="ts">
import Tags from '@layout/Tags.vue'
</script>

<template>
  <div class="outer-header">
    <div class="header">
      <tags class="tags-wrapper" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
$tab-height: var(--tab-height);

.outer-header {
  height: $tab-height;
  transition: all linear 0.2s;
}

.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: $tab-height;
  color: var(--el-bar-text-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--tab-bg);
  background-size: 100% 100%;

  .tags-wrapper {
    flex: 1;
    min-width: 0;
    margin-right: 15px;
  }

  .logo {
    line-height: $tab-height;
    display: flex;
    align-items: center;
    font-size: 23px;
    font-weight: 500;
    width: fit-content;
    color: white;
  }

  .logo:hover {
    text-decoration: none;
    cursor: pointer;
  }
}

.header-right {
  float: right;
  padding-right: 20px;
}

.header-user-con {
  display: flex;
  height: $tab-height;
  align-items: center;
  color: #333;

  & > * {
    margin-left: 20px;
  }
}

.el-dropdown-link {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: var(--el-bar-text-color);
}

.el-dropdown-menu__item {
  text-align: center;
}
</style>
