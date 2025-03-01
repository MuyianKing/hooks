import process from 'node:process'
import { exec } from '@muyianking/build'
import { copySync, removeSync } from 'fs-extra/esm'

const root = process.cwd()
const dist = `${root}/dist`

// 发布入口
async function main() {
  // 清除以前的打包文件
  removeSync(dist)

  await exec('pnpm rslib build')

  // 将README.md拷贝到包中
  copySync('./README.md', `${dist}/README.md`)

  // 将LICENSE拷贝到包中
  copySync('./LICENSE', `${dist}/LICENSE`)

  // 将package.json拷贝到包中
  copySync('./package.json', `${dist}/package.json`)
}

main()
