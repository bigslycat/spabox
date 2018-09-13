FROM node:10.10.0-alpine as dependencies

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn --prod

FROM node:10.10.0-alpine as build

WORKDIR /app

COPY --from=dependencies /app .

COPY babel.config.js .
COPY rollup.config.js .
COPY src src

RUN yarn build

FROM nginx:1.15.3-alpine

RUN apk add --no-cache nodejs

WORKDIR /app

COPY --from=build /app/bin/build-nginx-config ./

CMD ./build-nginx-config && nginx -g 'daemon off;'

