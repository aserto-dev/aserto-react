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

Use the `useAserto` hook in your components to initialize (`init`), reload the access map (`reload`) or to access its state (`loading`, `accessMap`, `resourceMap`, etc):

```jsx
// src/App.js
import React from 'react'
import { useAserto } from '@aserto/aserto-react'
import { useAuth0 } from '@auth0/auth0-react'

function App() {
  const {
    loading,     // true while the state is loading
    isLoaded,    // true if the accessMap was loaded
    error,       // error object (if initOptions.throwOnError is false)
    identity,    // identity header to send to accessmap call
    setIdentity, // set the identity header 
    accessMap,   // access map
    resourceMap, // resourceMap() function (see below)
    init,        // init() function (see below)
    reload       // reload() function (see below)
  } = useAserto();

  // the Aserto hook needs a valid access token. 
  // to use Auth0 to return an access token, you can use the following:
  const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();

  // use an effect to load the Aserto access map 
  useEffect(() => {
    async function load() {
      const token = await getAccessTokenSilently();
      if (token) {
        await init({ accessToken: token });
      }
    }

    // load the access map when Auth0 has finished initializing
    if (!isLoading && isAuthenticated) {
      load();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]); 

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
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

### init()

Initialize the Aserto client.

```js
const { init, accessMap } = useAserto();
await init({
  serviceUrl: 'http://service-url', // defaults to windows.location.origin
  endpointName: '/__accessmap', // defaults to '/__accessmap'
  accessToken: '<VALID ACCESS TOKEN>', // REQUIRED
  throwOnError: true, // true: re-throw errors. false: set error object. defaults to true.
  defaultMap: { // an optional default resource map (default values below)
    visible: false,
    enabled: false
  }
});

// log the access map to the console
console.log(accessMap);
```

### reload(headers)

Re-load the access map for a service that exposes it.  If the `headers` parameter is passed in, it is passed through to the `AsertoClient` instance that will retrieve the access map from the API endpoint.

Note: `init()` must be called before `reload()`.

```js
const { reload, accessMap } = useAserto();
await reload();

// log the access map to the console
console.log(accessMap);
```

### identity and setIdentity

- `setIdentity` can be used to set the identity to pass as an `identity` HTTP header.  It will override an `identity` header that is passed into `reload(headers)`.  This is the preferred way to send an identity to the accessMap API, which can be used to override the Authorization header by the accessMap middleware.
- `identity` will return the current identity (or undefined if it hasn't been set).

### resourceMap('method, 'path')

Retrieves a map associated with a specific resource.

By convention, the `method` argument is an HTTP method (GET, POST, PUT, DELETE), and the `path` argument is in the form `/path/to/resource`. It may contain a `__id` component to indicate an parameter - for example, `/mycars/__id`.

If only the `method` argument is passed in, it is assumed to be a key into the `accessmap` (typically in the form of `METHOD/path/to/resource`).

The returned map will be in the following format: 
```js
{
  visible: true,
  enabled: false,
}
```

Note: `init()` must be called before `resourceMap()`.

```js
const { resourceMap } = useAserto();
const path = '/api/path';

// use the map to retrieve visibility of an element
const isVisible = aserto.resourceMap('GET', path).visible;

// use the map to determine whether an update operation is enabled
const isUpdateEnabled = aserto.resourceMap('PUT', path).enabled;

// print out access values for each verb on a resource
for (const verb of ['GET', 'POST', 'PUT', 'DELETE']) {
  const resource = aserto.resourceMap(verb, path));
  for (const access of ['visible', 'enabled']) {
    console.log(`${verb} ${path} ${access} is ${resource[verb][access]}`);
  }
}
```
