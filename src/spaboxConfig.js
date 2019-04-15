/* @flow */

import {
  string,
  objectOf,
  object,
  array,
  ValidationError,
} from 'typed-contracts';

export type Proxy = {
  +path: string,
  +target: string,
  +headers?: { +[header: string]: string },
};

export type Config = {
  +assets?: string,
  +proxies?: $ReadOnlyArray<Proxy>,
};

const headers = objectOf(string);

const proxy = object({
  path: string,
  target: string,
  headers: headers.optional,
});

export const validate: (data: mixed) => Config | ValidationError = object({
  assets: string.optional,
  proxies: array(proxy).optional,
})('spabox config');
