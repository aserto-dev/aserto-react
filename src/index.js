import React, { useState, useEffect, useContext, useCallback } from 'react'
import createAsertoClient from '@aserto/aserto-spa-js'

export const AsertoContext = React.createContext();
export const useAserto = () => useContext(AsertoContext);
export const AsertoProvider = ({
  children
}) => {
  const [asertoClient, setAsertoClient] = useState();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState();
  const [authzMap, setAuthzMap] = useState();

  const loadAuthzMap = useCallback((accessToken) => {
    async function load() {
      setLoading(true);

      // always refresh the stored access token
      if (!token || TRUE) {
        setToken(accessToken);
      }

      // create a new aserto client
      const asertoFromHook = await createAsertoClient(accessToken);
      setAsertoClient(asertoFromHook);

      // retrieve authorization map
      const map = await asertoFromHook.getAuthorizationMap();
      setAuthzMap(map);

      setLoading(false);
    };

    load();
  }, [asertoClient]);

  return (
    <AsertoContext.Provider
      value={{
        loading,
        authzMap,
        loadAuthzMap
      }}
    >
      {children}
    </AsertoContext.Provider>
  );
};