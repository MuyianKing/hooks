import path from 'node:path'
import { exec, getDir, getParams, showLog } from '@muyianking/build'
import { readJsonSync, writeJsonSync } from 'fs-extra/esm'
import inquirer from 'inquirer'

import ora from 'ora'

const __dirname = getDir(import.meta.url)

async function build() {
  const spinner = ora(`update package.json`).start()
  const package_path = path.resolve(__dirname, '../../package.json')
  const _config = readJsonSync(package_path)

  let version = `v${_config.version}`
  const params = getParams()

  // 如果外部传入版本号则以外部为准
  if (params.v) {
    version = `v${params.v}`
    _config.version = params.v
    writeJsonSync(package_path, _config, {
      spaces: 2,
    })
  }
  spinner.succeed('update package.json successfully')

  try {
    spinner.succeed('create package.json')
    showLog(spinner, 'create log')
    await exec('pnpm log')
    spinner.succeed('create log')
    showLog(spinner, 'git add .')
    await exec('git add .')
    spinner.succeed('git add .')
    showLog(spinner, 'git commit')
    await exec(`git commit -m"release: :package: ${version}"`)
    spinner.succeed('git commit')
    showLog(spinner, 'git push && git tag && git push')
    await exec(`git push && git tag ${version} && git push origin ${version}`)
    spinner.succeed('git push && git tag && git push')
    spinner.succeed('publish successful, waiting for GitHub to automatically Release it to npm')
  } catch (error) {
    spinner.fail('spinner')
    console.log(error)
  }
}

// 打包确认
function inquirerPrompt() {
  return new Promise((resolve, reject) => {
    inquirer.prompt([
      {
        type: 'list',
        name: 'release',
        message: '您确定切换到主分支并合并了最新的代码？',
        choices: ['是', '否'],
        filter(value) {
          return {
            是: '1',
            否: '2',
          }[value]
        },
      },
    ]).then((answers) => {
      resolve(answers)
    }).catch((error) => {
      reject(error)
    })
  })
}

inquirerPrompt().then(({ release }) => {
  if (release === '1') {
    build()
  }
})
