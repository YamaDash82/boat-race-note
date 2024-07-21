declare function require(moduleName: string): any;

const { version: appVersion } = require('../../../../package.json');

export const environment = {
  rootUrl: 'http://localhost:3000', 
  mode: 'development',
  appVersion: `dev:${appVersion}`
};
