/** 
const fs = require('fs');
const path = require('path');
const semver = require('semver');
const { prompt } = require('enquirer');
const consola = require('consola');
const { run } = require('./utils');

const packages = fs.readdirSync(path.resolve(__dirname, '../packages')).filter((package) => !package.includes('examples'));

const getPkgRoot = (pkg) => path.resolve(__dirname, `../packages/${pkg}`);

const inc = (i) => semver.inc(require('../../package.json').version, i);

const updateDeps = (pkg, depType, version) => {
  const deps = pkg[depType];
  if (!deps) return;
  Object.keys(deps).forEach((dep) => {
    if (dep.startsWith('@bi-editor-sdk') && packages.includes(dep.replace(/^@bi-editor-sdk\//, ''))) {
      consola.info(`${pkg.name} -> ${depType} -> ${dep}@${version}`);
      deps[dep] = version;
    }
  });
};

const updatePackage = (pkgRoot, version) => {
  const pkgPath = path.resolve(pkgRoot, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  pkg.version = version;
  updateDeps(pkg, 'dependencies', version);
  updateDeps(pkg, 'peerDependencies', version);
  fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
};

const updateVersions = (version) => {
  updatePackage(path.resolve(__dirname, '..'), version);
  packages.forEach((package) => updatePackage(getPkgRoot(package), version));
};

const publishPackage = async (pkgName, version) => {
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
        '--registry=http://r.npm.sankuai.com',
        `--cache=${path.resolve(process.env.HOME, '.cache/mnpm')}`,
        '--disturl=http://npm.sankuai.com/mirrors/node',
        `--userconfig=${path.resolve(process.env.HOME, '.mnpmrc')}`,
      ],
      {
        cwd: pkgRoot,
        stdio: 'pipe',
      },
    );
    consola.success(`Successfully published ${pkgName}@${version}`);
  } catch (e) {
    if (e.stderr.match(/previously published/)) {
      consola.error(`Skipping already published: ${pkgName}`);
    } else {
      throw e;
    }
  }
};

const main = async () => {
  const versionIncrements = ['patch', 'minor', 'major', 'prepatch', 'preminor', 'premajor', 'prerelease'];
  const { release } = await prompt({
    type: 'select',
    name: 'release',
    message: 'Select release type',
    choices: versionIncrements.map((i) => `${i} (${inc(i)})`),
  });
  const version = release.match(/\((.*)\)/)[1];
  if (!semver.valid(version)) {
    throw new Error(`invalid target version: ${version}`);
  }
  const { yes } = await prompt({
    type: 'confirm',
    name: 'yes',
    message: `Releasing v${version}. Confirm?`,
  });

  if (!yes) {
    return;
  }

  consola.info('\nUpdating cross versions...');
  updateVersions(version);

  consola.info('\nBuilding all packages...');
  await run('yarn', ['build']);

  const { stdout } = await run('git', ['diff'], { stdio: 'pipe' });
  if (stdout) {
    consola.info('\nCommitting changes...');
    await run('git', ['add', '-A']);
    await run('git', ['commit', '-m', `release: v${version}`, '-n']);
  } else {
    consola.warn('No changes to commit.');
  }

  consola.info('\nPublishing packages...');
  for (const pkg of packages) {
    await publishPackage(pkg, version);
  }

  consola.info('\nCleanning dists...');
  run('yarn', ['clean']);
};

main();
*/
