import process from 'node:process'

const root = process.cwd()
const dist = `${root}/dist`
const plain = root + '/x'
const other = process.env.HOME

console.log(dist, plain, other)
