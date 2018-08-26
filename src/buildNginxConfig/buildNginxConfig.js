/* @flow */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

import { nginxConfigRender } from './nginxConfigRender';

const nameRegExp = /^proxies\.(json|ya?ml)$/;
const jsonReqExp = /\.json$/;

const proxies = (() => {
  const dirName = process.cwd();

  const fileName = fs
    .readdirSync(dirName)
    .find(currentName => nameRegExp.test(currentName));

  if (!fileName) {
    console.warn('Proxies list not found');
    return;
  }

  const filePath = path.resolve(dirName, fileName);
  const fileContent = fs.readFileSync(filePath, 'utf8');

  if (jsonReqExp.test(filePath)) return JSON.parse(fileContent);

  return yaml.safeLoad(fileContent);
})();

const nginxConfig = nginxConfigRender(proxies);

fs.writeFileSync('/etc/nginx/nginx.conf', nginxConfig, 'utf8');
