FROM node:10.10.0-alpine as dependencies

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install --production

FROM node:10.10.0-alpine

WORKDIR /app

COPY --from=dependencies /app .
COPY src src

EXPOSE 3001 3002

CMD yarn start
