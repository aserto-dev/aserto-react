import React, { useState, useContext, useCallback } from 'react'
import createAsertoClient from '@aserto/aserto-spa-js'

export const AsertoContext = React.createContext();
export const useAserto = () => useContext(AsertoContext);
export const AsertoProvider = ({
  children
}) => {
  const [asertoClient, setAsertoClient] = useState();
  const [loading, setLoading] = useState(false);
  const [accessMap, setAccessMap] = useState();

  const init = useCallback((initOptions) => {
    async function initAserto() {
      setLoading(true);

      // create a new aserto client
      const asertoFromHook = await createAsertoClient(initOptions);
      setAsertoClient(asertoFromHook);

      setLoading(false);
    };

    initAserto();    
  }, []);

  const loadAccessMap = useCallback(() => {
    async function load() {
      setLoading(true);

      // retrieve access map
      const map = await asertoClient.getAccessMap();
      setAccessMap(map);

      setLoading(false);
    };

    if (!asertoClient && !loading) {
      throw new Error('aserto-react: must call init() before loadAccessMap()');
    } else {
      load();
    }
  }, [asertoClient, loading]);

  return (
    <AsertoContext.Provider
      value={{
        loading,
        accessMap,
        init,
        loadAccessMap
      }}
    >
      {children}
    </AsertoContext.Provider>
  );
};