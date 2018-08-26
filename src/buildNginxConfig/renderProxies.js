/* @flow */

import invariant from 'invariant';

export const renderProxies = (proxies: mixed): string => {
  if (proxies === undefined) return '';
  invariant(Array.isArray(proxies), 'Proxies config must be Array');

  return proxies
    .map(proxy => {
      invariant(
        proxy && typeof proxy == 'object',
        'Proxy entry must be Object',
      );
      invariant(typeof proxy.path == 'string', 'path property must be String');
      invariant(
        typeof proxy.target == 'string',
        'target property must be String',
      );

      invariant(
        proxy['add-headers'] === undefined ||
          (proxy['add-headers'] && typeof proxy['add-headers'] == 'object'),
        'add-headers property must be Object',
      );

      const { path, target } = proxy;

      const addHeadersRender = Object.entries(proxy['add-headers'])
        .map(
          ([name, value]: any) => `            add_header ${name} "${value}";`,
        )
        .join('\n');

      return `
        location ${path} {
${addHeadersRender}
            proxy_pass ${target};
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "Upgrade";
        }
      `;
    })
    .join('\n\n');
};
