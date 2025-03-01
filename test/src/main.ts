import pinia from '@/pinia'
import router from '@/router'
import { createApp } from 'vue'
import App from './App.vue'

createApp(App)
  .use(pinia)
  .use(router)
  .mount('#app')
