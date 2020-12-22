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

Use the `useAserto` hook in your components to load the authorization map (`loadAuthzMap`) or to access its state (`loading`, `authzMap`):

```jsx
// src/App.js
import React from 'react'
import { useAserto } from '@aserto/aserto-react'
import { useAuth0 } from '@auth0/auth0-react'

function App() {
  const {
    loading,
    authzMap,
    loadAuthzMap
  } = useAserto();

  // the Aserto hook needs a valid access token. 
  // to use Auth0 to return an access token, you can use the following:
  const { getAccessTokenSilently } = useAuth0();
  const accessToken = getAccessTokenSilently();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!authzMap) {
    loadAuthzMap(accessToken);
    return <div>Loading...</div>;
  } else {
    return (
      <div>
        { 
          // display the authz map as a string 
          authzMap 
        }
      </div>
    );
  } 
}

export default App
```