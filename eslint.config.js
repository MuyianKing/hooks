import antfu, { GLOB_JS, GLOB_JSX, GLOB_TS, GLOB_TSX, GLOB_VUE } from '@antfu/eslint-config'
import { base } from '@muyianking/config/eslint.config.js'

export default antfu({
  formatters: true,
  // JS 默认由 espree 解析，而 unused-imports/no-unused-vars 依赖 TS scope-manager 的
  // isValueReference 判断引用类型，espree 无此属性会把已使用变量误报为「只用作类型」，故让 JS 走 TS 解析器
  typescript: { files: [GLOB_JS, GLOB_JSX, GLOB_TS, GLOB_TSX, GLOB_VUE] },
}, {
  rules: {
    ...base,
    'vue/component-name-in-template-casing': ['error', 'kebab-case'],
  },
})
