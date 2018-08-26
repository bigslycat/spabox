#!/usr/bin/env node

const packageJSON = require('./package');

const regs = {
  major: /^(\d+)/,
  minor: /^(\d+\.\d+)/,
  patch: /^(\d+\.\d+\.\d+)/,
};

const types = ['major', 'minor', 'patch'];
const type = process.argv[2] || types[2];

if (!types.includes(type)) {
  throw new Error('Invalid version type');
}

console.log(regs[type].exec(packageJSON.version)[1]);
