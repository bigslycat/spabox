/* eslint no-console: off */

import { resolve } from 'path';

import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

const resolvePath = (...path) => resolve(__dirname, ...path);

export default {
  input: resolvePath('src', 'buildNginxConfig/index.js'),
  output: {
    file: resolvePath('build', 'build-nginx-config.js'),
    format: 'cjs',
  },
  plugins: [
    babel(),
    nodeResolve(),
    commonjs({
      include: 'node_modules/**',
    }),
  ],
  external: ['fs', 'path'],
};
