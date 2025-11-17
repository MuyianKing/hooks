import antfu from '@antfu/eslint-config'
import { base } from '@muyianking/config/eslint.config.js'

console.log(base)

export default antfu({
  formatters: true,
}, {
  rules: {
    ...base,
    'vue/component-name-in-template-casing': ['error', 'kebab-case'],
  },
})
