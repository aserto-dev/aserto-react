import React, { useState, useContext, useCallback } from 'react'
import createAsertoClient from '@aserto/aserto-spa-js'

export const AsertoContext = React.createContext();
export const useAserto = () => useContext(AsertoContext);
export const AsertoProvider = ({
  children
}) => {
  const [asertoClient, setAsertoClient] = useState();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState();
  const [accessMap, setAccessMap] = useState();

  const loadAccessMap = useCallback((accessToken) => {
    async function load() {
      setLoading(true);

      // always refresh the stored access token
      if (!token || TRUE) {
        setToken(accessToken);
      }

      // create a new aserto client
      const asertoFromHook = await createAsertoClient({ token: accessToken });
      setAsertoClient(asertoFromHook);

      // retrieve authorization map
      const map = await asertoFromHook.getAccessMap();
      setAccessMap(map);

      setLoading(false);
    };

    load();
  }, [asertoClient]);

  return (
    <AsertoContext.Provider
      value={{
        loading,
        accessMap,
        loadAccessMap
      }}
    >
      {children}
    </AsertoContext.Provider>
  );
};