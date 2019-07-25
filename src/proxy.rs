use std::{collections::HashMap, convert::From};

#[derive(Debug, Clone)]
pub struct Proxy {
    pub path: Option<String>,
    pub target: Option<String>,
    pub headers: HashMap<String, String>,
}

impl Proxy {
    pub fn new() -> Proxy {
        Proxy {
            path: None,
            target: None,
            headers: HashMap::new(),
        }
    }
}

impl From<&Proxy> for Proxy {
    fn from(proxy: &Proxy) -> Proxy {
        Proxy {
            path: proxy.path.clone(),
            target: proxy.target.clone(),
            headers: proxy.headers.clone(),
        }
    }
}
