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

  const init = async (initOptions) => {
      setLoading(true);
      const asertoFromHook = await createAsertoClient(initOptions);
      setAsertoClient(asertoFromHook);
      setLoading(false);
  }

  const loadAccessMap = async () => {
    setLoading(true);
    const map = await asertoClient.getAccessMap();
    setAccessMap(map);
    setLoading(false);
  }

  /*
  const initCallback = useCallback((...p) => {
    async function callInit(...p) {
      return init(...p);
    }
    return callInit(...p);
  // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, []);

  const loadAccessMapCallback = useCallback(() => {
    async function callLoad() {
      return load();
    }
    if (!asertoClient) {
      throw new Error('aserto-react: must call init() before loadAccessMap()');
    } else {
      return callLoad();    
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, []);
  */

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