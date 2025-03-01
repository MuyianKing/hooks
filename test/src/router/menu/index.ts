import Layout from '@layout/Main.vue'

export const menuList = [
  {
    path: '/auto-height',
    component: () => import('@views/auto-height/Index.vue'),
    meta: {
      title: '高度不定动画',
      icon: 'iconoir:list-select',
    },
  },
]

export default [
  {
    path: '/',
    component: Layout,
    redirect: '/auto-height',
    name: 'admin',
    children: menuList,
  },
]
