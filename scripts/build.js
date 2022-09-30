const consola = require('consola');
const { run } = require('./utils');

function build() {
  consola.info('Clean up');
  run('npm', ['run', 'clean']);

  consola.info('Build Vue3 Packages');
  run('pnpm', ['-C', 'packages/vue3-schema-form', 'build']);

  consola.info('Build Packages');
  run('rollup', ['-c']);

  consola.success('Build finished!');
}

build();
