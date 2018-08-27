/* eslint no-console: off */

import { resolve } from 'path';

import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

import packageJSON from './package.json';

const banner = `#!/usr/bin/env node

/**
 * ${packageJSON.name} v${packageJSON.version}
 * ${packageJSON.description}
 */
`;

const resolvePath = (...path) => resolve(__dirname, ...path);

export default {
  input: resolvePath('src', 'buildNginxConfig/index.js'),
  output: {
    file: resolvePath('bin', 'build-nginx-config'),
    format: 'cjs',
    banner,
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    nodeResolve(),
    commonjs({
      include: 'node_modules/**',
    }),
  ],
  external: ['fs', 'path'],
};
