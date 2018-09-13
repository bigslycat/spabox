FROM node:10.10.0-alpine as dependencies

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install --production

FROM node:10.10.0-alpine as build

WORKDIR /app

COPY --from=dependencies /app .

COPY public public
COPY src src

RUN yarn build

FROM noveo/spabox

COPY --from=build /app/build /var/www
