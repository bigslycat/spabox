/* @flow */

import * as spaboxConfig from '../spaboxConfig';

export const renderProxies = (
  proxies: $ReadOnlyArray<spaboxConfig.Proxy> = [],
): string =>
  proxies
    .map(proxy => {
      const addHeadersRender = Object.entries(proxy.headers || {})
        .map(([name, value]: any) => `add_header ${name} "${value}";`)
        .join('\n');

      return `
        location ${proxy.path} {
          ${addHeadersRender}
          proxy_pass ${proxy.target};
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection $connection_upgrade;
        }
      `;
    })
    .join('\n\n');
