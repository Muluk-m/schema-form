const consola = require('consola');
const { run } = require('./utils');

function build() {
  consola.info('Clean up');
  run('npm', ['run', 'clean']);

  consola.info('Build Packages');
  run('rollup', ['-c']);

  consola.info('Build React Packages');
  run('npm', ['run', '--cwd', 'packages/schema-form-react', 'build']);

  consola.success('Build finished!');
}

build();
