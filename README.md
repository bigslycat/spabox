# spabox [![Build Status][status-img]][status-url]

A usable box for single page applications for delivery to production.

## Usage

### Just run with env variables

```sh
docker run
  -v `pwd`/build:/var/www \
  -e ASSETS=/static \
  -e PROXY_FOO_PATH=/api/foo/ \
  -e PROXY_FOO_TARGET=https://foo.exapmle.com/api/ \
  -e PROXY_BAR_PATH=/api/bar/ \
  -e PROXY_BAR_TARGET=https://bar.exapmle.com/api/ \
  -e PROXY_BAR_AccessControlAllowOrigin='*' \
  noveo/spabox
```

### Just run with config

Create config.yml file (also you can use JSON format):

```yaml
assets: /static
proxies:
  - path: /api/foo/
    target: https://foo.exapmle.com/api/
  - path: /api/bar/
    target: https://bar.exapmle.com/api/
    headers:
      Access-Control-Allow-Origin: '*'
```

```sh
docker run -v `pwd`/config.yml:/spabox/config.yml noveo/spabox
```

### Extending of image (example for [CRA][] project)

```Dockerfile
FROM node:10.10.0-alpine as build

WORKDIR /app

COPY package.json .
COPY yarn.lock .
COPY public public
COPY src src

RUN  yarn install --production \
  && yarn build

FROM noveo/spabox

COPY --from=build /app/build /var/www
```

## Image API

### Files

- `/spabox/config.yml` (or `/spabox/config.json`)
  - `assets` property, `optional String` — expression of nginx location directive.
    All matching paths will be cache forever. **Warning**: if `assets` is defined, all
    mismatching path will be never cache.
  - `proxies` property, `optional Array of Object` — array of proxy configs.
  - `proxies[].path` property, `required String` — expression of nginx location directive.
    Request to all matching paths will be send to `proxies[].target`.
  - `proxies[].target` property, `required String` — nginx `proxy_pass` directive value.
  - `proxies[].headers` property, `optional Object of String` — headers.

### Environment variables

- `ASSETS` — equals `assets` property of config file. Case insensitive.
- `PROXY_[a-z0-9]+_PATH` — equals `proxies[].path` property of config file. Case insensitive.
- `PROXY_[a-z0-9]+_TARGET` — equals `proxies[].target` property of config file. Case insensitive.
- `PROXY_[a-z0-9]+_HeaderInCamelCase` — equals `proxies[].headers['Header-In-Camel-Case']`
  property of config file. Part of variable name before header name is case insensitive.

[CRA]: https://github.com/facebook/create-react-app
[status-url]: https://travis-ci.org/bigslycat/spabox
[status-img]: https://travis-ci.org/bigslycat/spabox.svg?branch=master
