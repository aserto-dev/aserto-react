import React, { useState, useContext, useCallback } from 'react'
import createAsertoClient from '@aserto/aserto-spa-js'

export const AsertoContext = React.createContext();
export const useAserto = () => useContext(AsertoContext);
export const AsertoProvider = ({
  children
}) => {
  const [asertoClient, setAsertoClient] = useState();
  const [loading, setLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState();
  const [accessMap, setAccessMap] = useState();
  const [throwOnError, setThrowOnError] = useState(true);
  const [defaultMap, setDefaultMap] = useState({
    visible: true,
    enabled: true,
    allowed: false
  });

  const init = async (initOptions) => {
    try {
      if (initOptions && initOptions.throwOnError == false) {
        setThrowOnError(false);
      }
      if (initOptions && initOptions.defaultMap) {
        setDefaultMap(initOptions.defaultMap);
      }
      setLoading(true);
      const asertoFromHook = await createAsertoClient(initOptions);
      setAsertoClient(asertoFromHook);
      setAccessMap(asertoFromHook.accessMap());
      setIsLoaded(true);      
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoaded(false);
      setLoading(false);
      if (!initOptions || initOptions.throwOnError) {
        throw error;
      }
    }
  }

  const reload = async () => {
    try {
      if (asertoClient) {
        setLoading(true);
        await asertoClient.reload();
        setAccessMap(asertoClient.accessMap());
        setLoading(false);
      }
    } catch (error) {
      if (throwOnError) {
        throw error;
      }
      console.error(error);
      setError(error);
      setIsLoaded(false);
      setLoading(false);
    }
  }

  const resourceMap = (path) => {
    if (asertoClient && path) {
      return asertoClient.resourceMap(path);
    }

    // no client or path
    if (throwOnError) {
      if (!asertoClient) {
        throw new Error('aserto-react: must call init() before resourceMap()');
      } 
      if (!path) {
        throw new Error('aserto-react: path is a required parameter');
      }
    } else {
      // return the default map
      return {
        GET: defaultMap,
        PUT: defaultMap,
        DELETE: defaultMap,
        POST: defaultMap
      }
    }
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