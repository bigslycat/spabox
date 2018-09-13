/* @flow */

module.exports = {
  presets: [
    '@babel/flow',
    [
      '@babel/env',
      {
        targets: { node: '8.9.3' },
        useBuiltIns: 'usage',
        modules: false,
      },
    ],
  ],
};
