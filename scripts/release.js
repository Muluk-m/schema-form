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
const step = (msg) => console.log(chalk.cyan(msg));

const versionIncrements = [
  'patch',
  'minor',
  'major',
  'prepatch',
  'preminor',
  'premajor',
  'prerelease',
];

const inc = (i) => semver.inc(curVersion, i);

const updateDeps = (pkg, depType, version) => {
  const deps = pkg[depType];
  if (!deps) return;
  Object.keys(deps).forEach((dep) => {
    if (
      dep === 'v3-schema-form' ||
      (dep.startsWith('@v3sf') && packages.includes(dep.replace(/^@v3sf\/$/, '')))
    ) {
      console.log(chalk.yellow(`${pkg.name} -> ${depType} -> ${dep}@${version}`));
      deps[dep] = version;
    }
  });
};

function updatePackage(pkgRoot, version) {
  const pkgPath = path.resolve(pkgRoot, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  pkg.version = version;
  // updateDeps(pkg, 'dependencies', version);
  // updateDeps(pkg, 'peerDependencies', version);
  fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
}

function updateVersions(version) {
  // 1. update root package.json
  updatePackage(path.resolve(__dirname, '..'), version);
  // 2. update all packages
  packages.forEach((p) => updatePackage(getPkgRoot(p), version));
}

async function pushOrigin(version) {
  await run('git', ['tag', `v${version}`]);
  await run('git', ['push', 'origin', '--tags']);
  await run('git', ['push']);
}

async function publishPackage(pkgName, version) {
  const pkgRoot = getPkgRoot(pkgName);
  const pkgPath = path.resolve(pkgRoot, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  if (pkg.private) {
    return;
  }
  step(`Publishing ${pkgName}...`);
  try {
    await run('npm', ['publish', '--registry=https://registry.npmjs.org', '--access', 'public'], {
      cwd: pkgRoot,
      stdio: 'pipe',
    });
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
  step('\nUpdating cross dependencies...');
  updateVersions(targetVersion);

  // build all packages with types
  step('\nBuilding all packages...');
  await run('pnpm', ['build']);

  // generate changelog
  step('\nGenerating changelog...');
  await run(`pnpm`, ['run', 'changelog']);

  const { stdout } = await run('git', ['diff'], { stdio: 'pipe' });
  if (stdout) {
    step('\nCommitting changes...');
    await run('git', ['add', '-A']);
    await run('git', ['commit', '-m', `release: v${targetVersion}`, '-n']);
  } else {
    console.log('No changes to commit.');
  }

  // publish packages
  step('\nPublishing packages...');
  for (const pkg of packages) {
    await publishPackage(pkg, targetVersion);
  }
  // update tag
  step('\nPushing to GitHub...');
  pushOrigin(targetVersion);

  // clear lib
  step('\nCleanning libs...');
  run('pnpm', ['clean']);
}

main();
