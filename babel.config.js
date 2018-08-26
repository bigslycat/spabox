/* @flow */

module.exports = {
  presets: [
    '@babel/flow',
    [
      '@babel/env',
      {
        targets: { node: 8 },
        useBuiltIns: 'usage',
        modules: false,
      },
    ],
  ],
};
