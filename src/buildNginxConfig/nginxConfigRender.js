/* @flow */

import { renderProxies } from './renderProxies';

export const nginxConfigRender = (proxies: mixed) => `
user  nginx;
worker_processes  1;

error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    #gzip  on;

    server {
        listen       80;
        server_name  localhost;

        charset utf-8;

        root   /app;

        location / {
            add_header Cache-Control "must-revalidate, no-cache, no-store";
            try_files $uri /index.html;
        }

        location /assets {
            expires max;
        }

        map $http_upgrade $connection_upgrade {
            default upgrade;
            '' close;
        }

        ${renderProxies(proxies)}

        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   /usr/share/nginx/html;
        }
    }
}
`;
