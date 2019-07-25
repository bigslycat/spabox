#[macro_use]
extern crate lazy_static;

use std::fs::write;
use std::io::Error;

mod config;
mod proxy;
mod render;

use crate::config::Config;
use crate::render::render;

fn main() -> Result<(), Error> {
    let config = Config::from_env_vars();

    let nginx_config = render(&config);

    println!(
        "{} v{}\n",
        env!("CARGO_PKG_NAME"),
        env!("CARGO_PKG_VERSION"),
    );

    println!("Generated nginx config:\n{}", nginx_config);

    write("/etc/nginx/nginx.conf", &nginx_config)?;

    println!("Configuration successfully applied.");

    Ok(())
}
