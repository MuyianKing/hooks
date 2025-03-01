<script setup lang="ts">
</script>

<template>
  <router-view />
</template>

<style lang='scss'>
@use './assets/style/index.css';

// 通用配置
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  outline: none;
  font-family: 'microsoft yahei', arial, STHeiTi, sans-serif;
}

html,
body,
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

a {
  text-decoration: none;
}

/*滚动条整体样式*/
/*高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
  height: 10px;
  width: 8px;
}

/*滚动条里面小方块*/
::-webkit-scrollbar-thumb {
  border-radius: 8px;
  background: rgba(144, 147, 153, 0.5);
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(144, 147, 153, 0.8);
}

/*滚动条里面轨道*/
::-webkit-scrollbar-track {
  background: transparent;
  box-shadow: none;
  border-radius: 8px;
}

:root {
  // 主题色
  --color-primary: #5692ff;
  --color-success: #4bcc8b;
  --color-warning: #ff8e56;
  --color-danger: #ff5656;
  --color-info: #babdc6;

  // 背景色
  --bg-color: #f5f6f6;

  // 导航栏背景色
  --tab-bg: #fff;
  // 导航栏高度
  --tab-height: 50px;
  // 导航栏文字高亮颜色
  --tab-light-color: #5692ff;

  // 侧边栏背景色
  --side-bg: #fff;
  // 侧边栏文件高亮颜色
  --side-light-color: #5692ff;
  // 侧边栏宽度
  --side-width: 180px;
  // 侧边栏el-menu-item的高度
  --side-menu-item-height: 45px;
}
</style>
