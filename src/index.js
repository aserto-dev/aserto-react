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
  const [displayStateMap, setDisplayStateMap] = useState();
  const [identity, setIdentity] = useState();
  const [throwOnError, setThrowOnError] = useState(true);
  const [defaultDisplayState, setDefaultDisplayState] = useState({
    visible: false,
    enabled: false
  });

  const init = async (initOptions) => {
    try {
      if (initOptions && initOptions.throwOnError == false) {
        setThrowOnError(false);
      }
      if (initOptions && initOptions.defaultDisplayState) {
        setDefaultDisplayState(initOptions.defaultDisplayState);
      }
      setLoading(true);
      const asertoFromHook = await createAsertoClient(initOptions);
      setAsertoClient(asertoFromHook);
      setDisplayStateMap(asertoFromHook.displayStateMap());
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
        setDisplayStateMap(asertoClient.displayStateMap());
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

  const getDisplayState = (method, path) => {
    try {
      if (asertoClient && method) {
        return asertoClient.getDisplayState(method, path);
      }
  
      // no client or path
      if (throwOnError) {
        if (!asertoClient) {
          throw new Error('aserto-react: must call init() before getDisplayState()');
        } 
        if (!method) {
          throw new Error('aserto-react: missing required parameter');
        }
      } else {
        // return the default display state
        return defaultDisplayState;
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

  const loadDisplayStateMapCallback = useCallback(() => {
    async function callLoad() {
      return load();
    }
    if (!asertoClient) {
      throw new Error('aserto-react: must call init() before loadDisplayStateMap()');
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
        displayStateMap,
        init,
        reload,
        getDisplayState,
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