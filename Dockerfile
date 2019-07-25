FROM rust:1.36.0-slim-buster

WORKDIR /spabox

COPY . .

RUN cargo build --release

FROM nginx:1.17.2-alpine

COPY --from=build /spabox/target/release/spabox /usr/local/bin/build-nginx-config

CMD build-nginx-config && nginx -g 'daemon off;'
