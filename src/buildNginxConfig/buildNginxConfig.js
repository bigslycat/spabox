/* @flow */

import fs from 'fs';

import kebabCase from 'lodash/kebabCase';
import set from 'lodash/set';

import { readConfig } from './readConfig';
import { nginxConfigRender } from './nginxConfigRender';

const config = {
  ...readConfig(process.cwd()),
};

const envReg = /^proxy_+([a-z0-9]+)_+([a-z0-9_]+)$/i;
const proxyPropReg = /^(path|target)$/i;

const proxies: $ReadOnlyArray<any> = Object.values(
  Object.entries(process.env).reduce((acc, [key, value]) => {
    const res = envReg.exec(key);

    if (!res) return acc;

    const [, entryName, propName] = res;

    if (proxyPropReg.test(propName)) {
      set(acc, [entryName, propName.toLowerCase()], value);
    } else {
      set(acc, [entryName, 'headers', kebabCase(propName)], value);
    }

    return acc;
  }, {}),
).filter((proxy: any) => proxy.path && proxy.target);

const assets = process.env.ASSETS || process.env.assets;

if (assets) config.assets = assets;
if (proxies.length) config.proxies = proxies;

const nginxConfig = nginxConfigRender(config);

console.log('Current config:', JSON.stringify(config, null, '  '));
console.log('Generated nginx config:');
console.log(nginxConfig);

fs.writeFileSync('/etc/nginx/nginx.conf', nginxConfig, 'utf8');
