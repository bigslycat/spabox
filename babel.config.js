/* @flow */

module.exports = {
  presets: [
    '@babel/flow',
    [
      '@babel/env',
      {
        targets: { node: 'current' },
        useBuiltIns: 'usage',
        modules: false,
      },
    ],
  ],
};
