# Aserto React SDK

Loosely modeled after the [Auth0 React SDK](https://github.com/auth0/auth0-react).

This SDK uses the [Aserto javascript SPA SDK](https://github.com/aserto-dev/aserto-spa-js).

## Installation

Using [npm](https://npmjs.org):

```sh
npm install @aserto/aserto-react
```

Using [yarn](https://yarnpkg.com):

```sh
yarn add @aserto/aserto-react
```

## Getting Started

Configure the SDK by wrapping your application in `AsertoProvider`. If using in conjunction with the `Auth0Provider`, `AsertoProvider` should be nested inside of it.

```jsx
// src/index.js
import React from 'react'
import ReactDOM from 'react-dom'
import { AsertoProvider } from '@aserto/aserto-react'
import { Auth0Provider } from '@auth0/auth0-react'
import App from './App'

ReactDOM.render(
  <Auth0Provider
    domain="YOUR_AUTH0_DOMAIN"
    clientId="YOUR_AUTH0_CLIENT_ID"
    redirectUri={window.location.origin}
  >
    <AsertoProvider>
      <App />
    </AsertoProvider>
  </Auth0Provider>,
  document.getElementById('app')
);
```

Use the `useAserto` hook in your components to initialize (`init`), reload the access map (`reload`) or to access its state (`loading`, `accessMap`):

```jsx
// src/App.js
import React from 'react'
import { useAserto } from '@aserto/aserto-react'
import { useAuth0 } from '@auth0/auth0-react'

function App() {
  const {
    loading,
    accessMap,
    resourceMap,
    init,
    loadAccessMap
  } = useAserto();

  // the Aserto hook needs a valid access token. 
  // to use Auth0 to return an access token, you can use the following:
  const { isLoading, error, isAuthenticated, getAccessTokenSilently } = useAuth0();

  // use an effect to load the Aserto access map 
  useEffect(() => {
    async function load() {
      const token = await getAccessTokenSilently();
      if (token) {
        await init({ accessToken: token });
      }
    }

    // load the access map when Auth0 has finished initializing
    if (!error && !isLoading && isAuthenticated) {
      load();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isAuthenticated, error]); 

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!accessMap) {
    init();
    return <div>Loading...</div>;
  } else {
    return (
      <div>
        { 
          // display the access map as a string 
          accessMap 
        }
      </div>
    );
  } 
}

export default App
```

### Initialize the Aserto client

```js
const { init, accessMap } = useAserto();
await init({
  serviceUrl: 'http://service-url', // defaults to windows.location.origin
  endpointName: '/__accessmap', // defaults to '/__accessmap',
  accessToken: '<VALID ACCESS TOKEN>' // REQUIRED
});

// log the access map to the console
console.log(accessMap);
```

### reload()

Re-load the access map for a service that exposes it. 

`init()` must be called before the `reload()`.

```js
const { reload, accessMap } = useAserto();
await reload();

// log the access map to the console
console.log(accessMap);
```

### resourceMap('path')

Retrieves the resource map associated with a specific resource.

The `path` argument is in the form `/path/to/resource`. It may contain a `{id}` component to indicate an parameter.

The returned map will be in the following format: 
```js
{
  get: {
    visible: true,
    enabled: false,
    allowed: false
  },
  post: {
    visible: true,
    enabled: false,
    allowed: false
  },
  put: {
    //...
  },
  delete: {
    //...
  }
}
```

Note: `init()` must be called before `resourceMap()`.

```js
const { resourceMap } = useAserto();
const path = '/api/path';
const resource = aserto.resourceMap(path));

// use the map to retrieve visibility of an element
const isVisible = resource.get.visible;

// use the map to determine whether an update operation is enabled
const isUpdateEnabled = resource.put.enabled;

// print out access values for each verb on a resource
for (const verb of ['get', 'post', 'put', 'delete']) {
  for (const access of ['visible', 'enabled', 'allowed']) {
    console.log(`${verb} ${path} ${access} is ${resource[verb][access]}`);
  }
}
```
