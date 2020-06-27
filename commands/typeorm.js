/*
 * This script sets up the env for typeorm. So that your credentials are
 * properly taken into account
 */
const { execSync } = require('child_process')

require('../env.config')

let args = ''
if (process.argv.length > 2) {
  args = process.argv.slice(2).join(' ')
}

try {
  execSync(`node --require ts-node/register ./node_modules/typeorm/cli.js ${args}`, {
    stdio: 'inherit',
  })
  // eslint-disable-next-line no-empty
} catch {}
