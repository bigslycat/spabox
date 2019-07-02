FROM node:12.4.0-alpine as dependencies

WORKDIR /spabox

COPY package.json .
COPY yarn.lock .

RUN yarn --prod

FROM node:12.4.0-alpine as build

WORKDIR /spabox

COPY --from=dependencies /spabox .

COPY babel.config.js .
COPY rollup.config.js .
COPY src src

RUN yarn build

FROM nginx:1.17.1-alpine

WORKDIR /spabox

COPY --from=build /spabox/bin/build-nginx-config ./

CMD ./build-nginx-config && nginx -g 'daemon off;'

