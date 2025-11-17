import { defineConfig } from '@rslib/core'

export default defineConfig({
  lib: [
    {
      format: 'esm',
      syntax: 'es2021',
      dts: true,
    },
  ],
  output: {
    minify: {
      jsOptions: {
        minimizerOptions: {
          format: {
            comments: 'all', // 将保留所有注释
          },
          mangle: false,
          minify: false,
          compress: true,
        },
      },
    },
  },
  source: {
    entry: {
      index: './hooks/index.ts',
    },
  },
})
