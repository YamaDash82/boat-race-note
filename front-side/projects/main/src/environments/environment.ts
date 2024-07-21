declare function require(moduleName: string): any;

const { version: appVersion } = require('../../../../package.json');

export const environment = {
  rootUrl: '', 
  mode: 'production', 
  appVersion: `Ver:${appVersion}`
};
