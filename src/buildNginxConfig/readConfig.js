/* @flow */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

import * as spaboxConfig from '../spaboxConfig';

const nameRegExp = /^config\.(json|ya?ml)$/;
const jsonReqExp = /\.json$/;

export const readConfig = (dirName: string): spaboxConfig.Config => {
  const fileName = fs
    .readdirSync(dirName)
    .find(currentName => nameRegExp.test(currentName));

  if (!fileName) {
    console.warn('Config file is not found');
    return {};
  }

  const filePath = path.resolve(dirName, fileName);
  const fileContent = fs.readFileSync(filePath, 'utf8');

  const result = spaboxConfig.validate(
    jsonReqExp.test(filePath)
      ? JSON.parse(fileContent)
      : yaml.safeLoad(fileContent),
  );

  if (result instanceof Error) throw result;

  return result;
};
