FROM rust:1.36.0-slim-buster as build

WORKDIR /spabox

COPY . .

RUN rustup target add x86_64-unknown-linux-musl \
  && cargo build --release --target=x86_64-unknown-linux-musl

FROM nginx:1.17.2-alpine

COPY --from=build /spabox/target/x86_64-unknown-linux-musl/release/spabox /usr/local/bin/build-nginx-config

CMD build-nginx-config && nginx -g 'daemon off;'
