import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(createPersistedState({
  key: id => `${id.toString().toUpperCase()}_STORAGE`,
  storage: localStorage,
}))

export default pinia
