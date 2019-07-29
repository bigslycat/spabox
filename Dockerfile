FROM alpine:3.10.1 as build

WORKDIR /spabox

COPY . .

RUN apk add --no-cache rust cargo \
  && cargo build --release

FROM nginx:1.17.2-alpine

RUN apk add --no-cache libgcc

COPY --from=build /spabox/target/release/spabox /usr/local/bin/build-nginx-config

CMD build-nginx-config && nginx -g 'daemon off;'
