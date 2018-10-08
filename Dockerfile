FROM node:10.10.0-alpine as dependencies

WORKDIR /spabox

COPY package.json .
COPY yarn.lock .

RUN yarn --prod

FROM node:10.10.0-alpine as build

WORKDIR /spabox

COPY --from=dependencies /spabox .

COPY babel.config.js .
COPY rollup.config.js .
COPY src src

RUN yarn build

FROM nginx:1.15.3-alpine

RUN apk add --no-cache nodejs

WORKDIR /spabox

COPY --from=build /spabox/bin/build-nginx-config ./

CMD ./build-nginx-config && nginx -g 'daemon off;'

