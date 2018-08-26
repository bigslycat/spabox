FROM node:10.9.0-alpine as builder

WORKDIR /app

ADD package.json ./
ADD yarn.lock ./
ADD babel.config.js ./
ADD rollup.config.js ./
ADD src ./src

RUN yarn install --production && yarn build

FROM nginx:1.15.2-alpine

RUN apk add --no-cache nodejs

WORKDIR /app

COPY --from=builder /app/bin/build-nginx-config ./

CMD ./build-nginx-config && nginx -g 'daemon off;'

