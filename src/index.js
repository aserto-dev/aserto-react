import React, { useState, useContext, useCallback } from 'react'
import createAsertoClient from '@aserto/aserto-spa-js'

export const AsertoContext = React.createContext();
export const useAserto = () => useContext(AsertoContext);
export const AsertoProvider = ({
  children
}) => {
  const [asertoClient, setAsertoClient] = useState();
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState();
  const [accessMap, setAccessMap] = useState();

  const init = async (initOptions) => {
    try {
    setLoading(true);
    const asertoFromHook = await createAsertoClient(initOptions);
    setAsertoClient(asertoFromHook);
    setAccessMap(asertoFromHook.accessMap());
    setIsLoaded(true);      
    setLoading(false);
  } catch (error) {
    setError(error);
    setIsLoaded(false);
    setLoading(false);
  }
}

  const reload = async () => {
    if (!asertoClient) {
      throw new Error('aserto-react: must call init() before reload()');
    } else {
      setLoading(true);
      await asertoClient.reload();
      setAccessMap(asertoClient.accessMap());
      setLoading(false);
    }
  }

  const resourceMap = (path) => {
    if (!asertoClient) {
      throw new Error('aserto-react: must call init() before resourceMap()');
    } 
    if (!path) {
      throw new Error('path is a required parameter');
    }
    return asertoClient.resourceMap(path);
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
        reload,
        resourceMap,
        isLoaded,
        error
      }}
    >
      {children}
    </AsertoContext.Provider>
  );
};