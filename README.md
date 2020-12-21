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
import App from './App'

// this example initializes the Aserto Provider with a getToken 
// function supplied by the Auth0 React SDK
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react'
const { getAccessTokenSilently } = useAuth0();

ReactDOM.render(
  <Auth0Provider
    domain="YOUR_AUTH0_DOMAIN"
    clientId="YOUR_AUTH0_CLIENT_ID"
    redirectUri={window.location.origin}
  >
    <AsertoProvider
      getToken={getAccessTokenSilently}
    >
      <App />
    </AsertoProvider>
  </Auth0Provider>,
  document.getElementById('app')
);
```

Use the `useAserto` hook in your components to access authorization map state (`loading`, `authzMap`) or to force it to load (`loadAuthzMap`):

```jsx
// src/App.js
import React from 'react'
import { useAserto } from '@aserto/aserto-react'

function App() {
  const {
    loading,
    authzMap,
    loadAuthzMap
  } = useAserto();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!authzMap) {
    loadAuthzMap();
    return <div>Loading...</div>;
  } else {
    return (
      <div>
        { authzMap }
      </div>
    );
  } 
}

export default App
```