/** 
const consola = require('consola');
const { run } = require('./utils');

function build() {
  consola.info('Clean up');
  run('yarn', ['clean']);

  consola.info('Build Packages');
  run('rollup', ['-c']);

  consola.info('Build Vue Packages');
  run('yarn', ['--cwd', 'packages/components-vue', 'build']);

  consola.success('Build finished!');
}

build();
*/
