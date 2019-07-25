use heck::KebabCase;
use regex::Captures;
use regex::Regex;
use std::collections::HashMap;
use std::env::vars;

use crate::proxy::Proxy;

pub fn get_match(captures: &Captures<'_>, index: usize) -> Option<String> {
    captures.get(index).map(|x| x.as_str().to_string())
}

pub fn get_proxy(proxies: &HashMap<String, Proxy>, proxy_name: &str) -> Proxy {
    match proxies.get(proxy_name) {
        Some(proxy) => Proxy::from(proxy),
        None => Proxy::new(),
    }
}

#[derive(Debug, Clone)]
pub struct Config {
    pub assets: Option<String>,
    pub headers: HashMap<String, String>,
    pub proxies: HashMap<String, Proxy>,
}

impl Config {
    pub fn new() -> Config {
        Config {
            assets: None,
            headers: HashMap::new(),
            proxies: HashMap::new(),
        }
    }

    pub fn from_env_vars() -> Config {
        let mut config = Self::new();

        lazy_static! {
            static ref ASSETS: Regex = Regex::new("(?i)^assets$").unwrap();
            static ref HEADER: Regex = Regex::new("(?i)^header_+([a-z0-9]+)$").unwrap();
            static ref PROXY_PATH: Regex = Regex::new("(?i)^proxy_+([a-z0-9]+)_+path$").unwrap();
            static ref PROXY_TARGET: Regex =
                Regex::new("(?i)^proxy_+([a-z0-9]+)_+target$").unwrap();
            static ref PROXY_HEADER: Regex =
                Regex::new("(?i)^proxy_+([a-z0-9]+)_+([a-z0-9_]+)$").unwrap();
        }

        for (key, value) in vars() {
            let key = key.as_str();
            if ASSETS.is_match(key) {
                config.assets = Some(value);
            } else if let Some(captures) = HEADER.captures(key) {
                let header_name = get_match(&captures, 1).unwrap();
                config.headers.insert(header_name.to_kebab_case(), value);
            } else if let Some(captures) = PROXY_PATH.captures(key) {
                let proxy_name = get_match(&captures, 1).unwrap();
                let mut proxy = get_proxy(&config.proxies, &proxy_name);
                proxy.path = Some(value);
                config.proxies.insert(proxy_name, proxy);
            } else if let Some(captures) = PROXY_TARGET.captures(key) {
                let proxy_name = get_match(&captures, 1).unwrap();
                let mut proxy = get_proxy(&config.proxies, &proxy_name);
                proxy.target = Some(value);
                config.proxies.insert(proxy_name, proxy);
            } else if let Some(captures) = PROXY_HEADER.captures(key) {
                let proxy_name = get_match(&captures, 1).unwrap();
                let header_name = get_match(&captures, 2).unwrap();
                let mut proxy = get_proxy(&config.proxies, &proxy_name);
                proxy.headers.insert(header_name.to_kebab_case(), value);
                config.proxies.insert(proxy_name, proxy);
            }
        }

        config
    }
}
