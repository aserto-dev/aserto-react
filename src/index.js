//import React, { useState, useContext, useCallback } from 'react'
import React, { useState, useContext } from 'react'
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
  const [identity, setIdentity] = useState();
  const [throwOnError, setThrowOnError] = useState(true);
  const [defaultMap, setDefaultMap] = useState({
    visible: false,
    enabled: false
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

  const reload = async (headers) => {
    try {
      if (asertoClient) {
        setLoading(true);
        if (identity) {
          if (headers) {
            headers.identity = identity;
          } else {
            headers = { identity };
          }
        }
        await asertoClient.reload(headers);
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

  const resourceMap = (method, path) => {
    try {
      if (asertoClient && method) {
        return asertoClient.resourceMap(method, path);
      }
  
      // no client or path
      if (throwOnError) {
        if (!asertoClient) {
          throw new Error('aserto-react: must call init() before resourceMap()');
        } 
        if (!method) {
          throw new Error('aserto-react: missing required parameter');
        }
      } else {
        // return the default map
        return defaultMap;
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
        identity,
        setIdentity,
        error
      }}
    >
      {children}
    </AsertoContext.Provider>
  );
};