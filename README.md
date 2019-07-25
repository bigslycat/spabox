# spabox ![Docker Cloud Build Status][build-status]

Tiny and simple DevOps tool for SPA delivery

This docker image allows you to host a static SPA build
and mount any API on the same host. Based on nginx.

## Usage

### Docker CLI

```sh
docker run
  -v `pwd`/build:/var/www:ro \
  -e ASSETS=/static \
  -e HEADER_ContentSecurityPolicy="default-src 'self'; img-src https://*; child-src 'none';"
  -e PROXY_FOO_PATH=/api/foo/ \
  -e PROXY_FOO_TARGET=https://foo.exapmle.com/api/ \
  -e PROXY_BAR_PATH=/api/bar/ \
  -e PROXY_BAR_TARGET=https://bar.exapmle.com/api/ \
  -e PROXY_BAR_AccessControlAllowOrigin='*' \
  bigslycat/spabox
```

### Docker Compose

```yaml
version: '3.7'
services:
  app:
    image: bigslycat/spabox
    volumes:
      - ./build:/var/www:ro
    environment:
      ASSETS: /static
      HEADER_ContentSecurityPolicy: default-src 'self'; img-src https://*; child-src 'none';
      PROXY_FOO_PATH: /api/foo/
      PROXY_FOO_TARGET: https://foo.exapmle.com/api/
      PROXY_BAR_PATH: /api/bar/
      PROXY_BAR_TARGET: https://bar.exapmle.com/api/
      PROXY_BAR_AccessControlAllowOrigin: *
```

### Extending of image

```Dockerfile
FROM node:12.6.0-alpine as build

WORKDIR /app

COPY package.json .
COPY yarn.lock .
COPY public public
COPY src src

RUN  yarn install --production \
  && yarn build

FROM bigslycat/spabox

ENV ASSETS=/static

COPY --from=build /app/build /var/www
```

### Environment variables

- `ASSETS` — If this parameter is defined, the matching paths are cached forever,
  and for the root location (`location / { ... }` in nginx config), caching is completely disabled.
  This is useful when you build JS and assets with hash sum of file in filenames.
  If this parameter is not defined, root location will have default cache settings.

- `HEADER_CamelCaseHeaderName` — header for root location.
  Second part of variable name must be in camelCase/PascalCase.

- `PROXY_[a-z0-9]+_PATH` — Local path for proxying to target URL.
  Corresponds to path of `location` nginx directive.

- `PROXY_[a-z0-9]+_TARGET` — URL for proxying from local path.
  Corresponds to `proxy_pass` nginx directive.

- `PROXY_[a-z0-9]+_CamelCaseHeaderName` — header for proxy.
  Third part of variable name must be in camelCase/PascalCase.

[build-status]: https://img.shields.io/docker/cloud/build/bigslycat/spabox.svg?style=flat
[CRA]: https://github.com/facebook/create-react-app
[status-url]: https://travis-ci.org/bigslycat/spabox
[status-img]: https://travis-ci.org/bigslycat/spabox.svg?branch=master
[greekeeper-img]: https://badges.greenkeeper.io/bigslycat/spabox.svg
[greekeeper-url]: https://badges.greenkeeper.io/bigslycat/spabox.svg
