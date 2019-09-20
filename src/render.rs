use crate::config::Config;
use crate::proxy::Proxy;

fn add_header(name: &str, value: &str) -> String {
    format!("add_header {} \"{}\" always;", name, value)
}

fn render_root(config: &Config) -> String {
    format!(
        "location / {{
                {}
                {}
                try_files $uri /index.html;
            }}",
        config.assets.clone().map_or("".to_string(), |_| add_header(
            "Cache-Control",
            "must-revalidate, no-cache, no-store"
        )),
        config
            .headers
            .iter()
            .fold("".to_string(), |result, (name, value)| result
                + add_header(name, value).as_str())
    )
}

fn render_assets(config: &Config) -> String {
    match &config.assets {
        Some(assets) => format!("location {} {{ expires max; }}", assets),
        None => "".to_string(),
    }
}

fn render_proxies(config: &Config) -> String {
    config
        .proxies
        .values()
        .fold("".to_string(), |result, proxy| match proxy {
            Proxy {
                target: Some(target),
                path: Some(path),
                headers,
            } => {
                result
                    + format!(
                        "
            location {} {{
                {}
                proxy_pass {};
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection $connection_upgrade;
            }}",
                        path,
                        headers.iter().fold("".to_string(), |acc, (name, value)| {
                            acc + add_header(name, value).as_str()
                        }),
                        target,
                    )
                    .as_str()
            }
            _ => result,
        })
}

pub fn render(config: &Config) -> String {
    format!(
        "
    user                nginx;
    worker_processes    1;
    error_log           /var/log/nginx/error.log warn;
    pid                 /var/run/nginx.pid;

    events {{
      worker_connections    1024;
    }}

    http {{
        include             /etc/nginx/mime.types;
        default_type        application/octet-stream;
        log_format  main    '$remote_addr - $remote_user [$time_local] \"$request\" '
                            '$status $body_bytes_sent \"$http_referer\" '
                            '\"$http_user_agent\" \"$http_x_forwarded_for\"';

        access_log          /var/log/nginx/access.log main;
        sendfile            on;
        #tcp_nopush         on;
        keepalive_timeout   65;
        #gzip               on;

        map $http_upgrade $connection_upgrade {{
            default upgrade;
            '' close;
        }}

        server {{
            listen          80;
            server_name     localhost;
            charset         utf-8;
            root            /var/www;

            # root:
            {}

            # assets:
            {}

            # proxies:

            {}

            # redirect server error pages to the static page /50x.html
            error_page 500 502 503 504 /50x.html;
            location = /50x.html {{
                root /usr/share/nginx/html;
            }}
        }}
    }}
    ",
        render_root(config),
        render_assets(config),
        render_proxies(config)
    )
}
