const path = require('path');
const { prompt } = require('enquirer');
const fs = require('fs');
const chalk = require('chalk');
const semver = require('semver');
const consola = require('consola');
const { run } = require('./utils');

const curVersion = require('../package.json').version;

const packages = fs
  .readdirSync(path.resolve(__dirname, '../packages'))
  .filter((p) => !p.endsWith('.ts') && !p.startsWith('.'));

const getPkgRoot = (pkg) => path.resolve(__dirname, `../packages/${pkg}`);

const versionIncrements = ['patch', 'minor', 'major', 'prepatch', 'preminor', 'premajor', 'prerelease'];

const inc = (i) => semver.inc(curVersion, i);

const updateDeps = (pkg, depType, version) => {
  const deps = pkg[depType];
  if (!deps) return;
  Object.keys(deps).forEach((dep) => {
    if (dep.startsWith('@') && packages.includes(dep.replace(/^@\//, ''))) {
      console.log(chalk.yellow(`${pkg.name} -> ${depType} -> ${dep}@${version}`));
      deps[dep] = version;
    }
  });
};

function updatePackage(pkgRoot, version) {
  const pkgPath = path.resolve(pkgRoot, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  pkg.version = version;
  updateDeps(pkg, 'dependencies', version);
  updateDeps(pkg, 'peerDependencies', version);
  fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
}

function updateVersions(version) {
  // 1. update root package.json
  updatePackage(path.resolve(__dirname, '..'), version);
  // 2. update all packages
  packages.forEach((p) => updatePackage(getPkgRoot(p), version));
}

async function publishPackage(pkgName, version) {
  const pkgRoot = getPkgRoot(pkgName);
  const pkgPath = path.resolve(pkgRoot, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  if (pkg.private) {
    return;
  }
  consola.info(`Publishing ${pkgName}...`);
  try {
    await run(
      'npm',
      [
        'publish',
        '--no-git-tag-version',
        'version',
        'patch',
      ],
      {
        cwd: pkgRoot,
        stdio: 'pipe',
      },
    );
    console.log(chalk.green(`Successfully published ${pkgName}@${version}`));
  } catch (e) {
    if (e.stderr.match(/previously published/)) {
      console.log(chalk.red(`Skipping already published: ${pkgName}`));
    } else {
      throw e;
    }
  }
}

async function main() {
  let targetVersion;
  const { release } = await prompt({
    type: 'select',
    name: 'release',
    message: 'Select release type',
    choices: versionIncrements.map((i) => `${i} (${inc(i)})`).concat(['custom']),
  });

  if (release === 'custom') {
    targetVersion = (
      await prompt({
        type: 'input',
        name: 'version',
        message: 'Input custom version',
        initial: curVersion,
      })
    ).version;
  } else {
    targetVersion = release.match(/\((.*)\)/)[1];
  }

  if (!semver.valid(targetVersion)) {
    throw new Error(`invalid target version: ${targetVersion}`);
  }

  const { yes } = await prompt({
    type: 'confirm',
    name: 'yes',
    message: `Releasing v${targetVersion}. Confirm?`,
  });

  if (!yes) {
    return;
  }
  // update all package versions and inter-dependencies
  consola.info('\nUpdating cross dependencies...');
  updateVersions(targetVersion);

  // build all packages with types
  consola.info('\nBuilding all packages...');
  await run('yarn', ['build']);

  const { stdout } = await run('git', ['diff'], { stdio: 'pipe' });
  if (stdout) {
    consola.info('\nCommitting changes...');
    await run('git', ['add', '-A']);
    await run('git', ['commit', '-m', `release: v${targetVersion}`, '-n']);
  } else {
    console.log('No changes to commit.');
  }

  // publish packages
  consola.info('\nPublishing packages...');
  for (const pkg of packages) {
    await publishPackage(pkg, targetVersion);
  }
  // publish packages
  consola.info('\nCleanning libs...');

  run('yarn', ['clean']);
}

main();
