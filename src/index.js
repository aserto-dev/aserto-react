import React, { useState, useEffect, useContext, useCallback } from 'react'
import createAsertoClient from '@aserto/aserto-spa-js'

export const AsertoContext = React.createContext();
export const useAserto = () => useContext(AsertoContext);
export const AsertoProvider = ({
  children,
  getToken
}) => {
  const [asertoClient, setAsertoClient] = useState();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState();
  const [authzMap, setAuthzMap] = useState();

  const loadAuthzMap = useCallback(() => {
    async function load() {
      setLoading(true);
      const map = await asertoClient.getAuthorizationMap();
      setAuthzMap(map);
      setLoading(false);
    };

    if (asertoClient) {
      load();
    }
  }, [asertoClient]);

  const initAserto = useCallback(() => {
    async function createClient() {
      const asertoFromHook = await createAsertoClient(token);
      setAsertoClient(asertoFromHook);

      loadAuthzMap();

      setLoading(false);
    };

    // if we don't have an access token, try to obtain one
    if (getToken && !token) {
      const accessToken = await getToken();
      if (accessToken) {
        setToken(accessToken);
      }
    }

    // if the client hasn't been created yet, create it now
    if (!asertoClient && token) {
      createClient();
    }

  }, [getToken, token]);

  useEffect(() => {
    initAserto();
    // eslint-disable-next-line
  }, [getToken, token]);

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