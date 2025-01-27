const semver = require('semver');
const { join } = require('path');
const { existsSync, readFileSync } = require('fs');
const { dependencies, devDependencies } = require('../package.json');

const PATH_NMODULES = '../node_modules';

const checkDependencies = () => {
  const root = __dirname;
  const pathNodeModules = join(root, PATH_NMODULES);
  const deps = Object.entries(dependencies ?? {});
  const devDeps = Object.entries(devDependencies ?? {});

  /** @type { { package: string; version: string; isDev: boolean; }[] } */
  const packagesWithErrors = [];
  let hasErrors = false;
  console.info('Comprobando dependencias instaladas...');
  for (const dep of deps) {
    const package = dep[0];
    const version = dep[1];

    const isDepOk = checkDependency(pathNodeModules, package, version);
    if (!isDepOk) {
      packagesWithErrors.push({
        package: package,
        version: version,
        isDev: false
      });
      hasErrors = true;
    }
  }

  console.info('');
  console.info('Comprobando dependencias de desarrollador instaladas...');
  for (const dep of devDeps) {
    const package = dep[0];
    const version = dep[1];

    const isDepOk = checkDependency(pathNodeModules, package, version);
    if (!isDepOk) {
      packagesWithErrors.push({
        package: package,
        version: version,
        isDev: true,
      });
      hasErrors = true;
    }
  }

  if (hasErrors) {
    console.error('\x1b[40m\x1b[31m %s \x1b[0m', 'Se han encontrado errores al comprobar las dependencias del proyecto.');
    console.error('\x1b[40m\x1b[31m %s \x1b[0m', 'Asegúrate de haber instalado las dependencias con `npm ci`');
    console.error('\x1b[40m\x1b[31m %s \x1b[0m', 'Dependencias con errores:');
    for (const dep of packagesWithErrors) {
      console.error('\x1b[40m\x1b[31m %s \x1b[0m', `- "${dep.package}": "${dep.version}" ${(dep.isDev ? '(devDependency)' : '')}`);
    }
    console.log('');
    console.error('\x1b[40m\x1b[31m %s \x1b[0m', '⚠️  Las dependencias requiren atención. Comprueba la salida de este terminal.');
    process.exitCode = 1;
    return;
  }

  console.info('');
  console.info('\x1b[40m\x1b[32m %s \x1b[0m', `☑️  Todas las dependencias en orden.`);
};

/**
 * @param {string} nodeModulesPath
 * @param {string} pkgName 
 * @param {string} pkgVersion 
 */
const checkDependency = (nodeModulesPath, pkgName, pkgVersion) => {
  const logPrefix = `[${pkgName}@${pkgVersion}]`;
  const path = join(nodeModulesPath, pkgName);

  let pkgVersionRange = null;
  try {
    pkgVersionRange = new semver.Range(pkgVersion, false);
  } catch { }

  if (pkgVersionRange == null) {
    console.error('\x1b[40m\x1b[31m %s \x1b[0m', `La versión [${pkgVersion}] no parece correcta.`);
    return false;
  }

  if (existsSync(path)) {
    const pathDepJson = join(path, 'package.json');
    if (existsSync(pathDepJson)) {
      const json = readFileSync(pathDepJson);
      const obj = JSON.parse(json);
      const installedVersion = obj.version;
      const installedSemver = semver.parse(installedVersion);
      if (installedSemver == null) {
        console.error('\x1b[40m\x1b[31m %s \x1b[0m', `${logPrefix} - No se ha podido comprobar la versión instalada [${installedVersion}].`);
        return false;
      }

      const isOk = installedSemver != null && semver.satisfies(installedSemver, pkgVersionRange);
      if (isOk) {
        console.info('\x1b[40m\x1b[32m %s \x1b[0m', `${logPrefix} - OK.`);
        return true;
      } else {
        console.error('\x1b[40m\x1b[31m %s \x1b[0m', `${logPrefix} - La versión instalada [${installedSemver.format()}] no satisface la necesidad del proyecto.`);
        return false;
      }
    } else {
      console.error('\x1b[40m\x1b[31m %s \x1b[0m', `${logPrefix} No se ha encontrado el archivo [${path}]`);
      return false;
    }
  } else {
    console.error('\x1b[40m\x1b[31m %s \x1b[0m', `${logPrefix} No se ha encontrado en node_modules.`);
    return false;
  }
};

checkDependencies();
