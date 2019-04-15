/* @flow */

module.exports = {
  presets: [
    '@babel/flow',
    [
      '@babel/env',
      {
        targets: { node: 10 },
        useBuiltIns: 'usage',
        corejs: { version: 3, proposals: true },
        modules: false,
      },
    ],
  ],
};
