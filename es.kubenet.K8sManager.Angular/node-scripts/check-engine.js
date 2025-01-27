const semver = require('semver');
const { engines } = require('../package.json');

const checkEngine = () => {
  const isNodeOk = semver.satisfies(process.version, engines.node);
  if (!isNodeOk) {
    console.error('\x1b[40m\x1b[31m %s \x1b[0m', `Tu versión de Node ${process.version} no es compatible con la del proyecto: ${engines.node}`);
    process.exit(1);
    return;
  }

  console.info('\x1b[40m\x1b[32m %s \x1b[0m', `Tu versión de Node ${process.version} coincide con el requisito del proyecto: ${engines.node}`);
};

checkEngine();
