import process from 'node:process'
import { exec } from '@muyianking/build'
import { copySync, removeSync } from 'fs-extra/esm'
import { getVersion, reWriteVersion } from './utils.js'

const root = process.cwd()

// 发布入口
async function main() {
  // 清除以前的打包文件
  removeSync(`${root}/dist`)

  await exec('pnpm build')

  // 将README.md拷贝到包中
  copySync('./README.md', `${root}/dist/README.md`)

  // 将LICENSE拷贝到包中
  copySync('./LICENSE', `${root}/dist/LICENSE`)

  // 读取版本号
  const { version, from } = getVersion(`${root}/package.json`)

  // 从命令行读取的版本需要回写package.json
  if (from !== 'package') {
    reWriteVersion(`${root}/package.json`, version)
  }

  // 回写dist的package.json
  // 将LICENSE拷贝到包中
  copySync('./package.json', `${root}/dist/package.json`)

  // 生成changelog.md
  await exec('pnpm log')

  const _version = `v${version}`

  // git commit
  await exec('git add .')
  await exec(`git commit -m"release: :package: ${_version}"`)

  // git提交并生成版本tag
  await exec(`git push && git tag ${_version} && git push origin ${_version}`)
}

main()
