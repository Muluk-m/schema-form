const { run } = require('./utils')
const consola = require('consola')

function build() {
  consola.info('Clean up')
  run('yarn', ['clean'])

  consola.info('Build Packages')
  run('rollup', ['-c'])

  consola.info('Build React Packages')
  run('yarn', ['--cwd', 'packages/schema-form-react', 'build'])

  // consola.info('Build React Packages')
  // run('yarn', ['--cwd', 'packages/components-react', 'build'])

  consola.success('Build finished!')
}

build()
