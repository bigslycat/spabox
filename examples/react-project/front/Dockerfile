FROM node:12.6.0-alpine as dependencies

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install --production

FROM node:12.6.0-alpine as build

WORKDIR /app

COPY --from=dependencies /app .

COPY public public
COPY src src

RUN yarn build

FROM bigslycat/spabox

COPY --from=build /app/build /var/www
