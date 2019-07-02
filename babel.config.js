/* @flow */

const { resolve } = require('path');

module.exports = {
  include: [
    resolve(__dirname, 'src'),
    resolve(__dirname, 'node_modules/typed-contracts'),
  ],
  presets: [
    '@babel/flow',
    [
      '@babel/env',
      {
        targets: { node: 'current' },
        useBuiltIns: 'usage',
        corejs: { version: 3, proposals: true },
        modules: false,
      },
    ],
  ],
};
