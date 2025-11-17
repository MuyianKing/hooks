import path from 'node:path'
import process from 'node:process'
import { exec, getDir } from '@muyianking/build'
import { copySync, readJsonSync, removeSync, writeJsonSync } from 'fs-extra/esm'

const __dirname = getDir(import.meta.url)

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
  const package_path = path.resolve(__dirname, '../../package.json')
  const _config = readJsonSync(package_path);

  // 删除不需要的配置
  ['scripts', 'devDependencies', 'config', 'lint-staged', 'publishConfig', 'resolutions'].forEach((key) => {
    delete _config[key]
  })

  writeJsonSync(path.resolve(__dirname, `${dist}/package.json`), _config, {
    spaces: 2,
  })
}

main()
