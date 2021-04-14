import React, { useState, useContext } from 'react'
import createAsertoClient from '@aserto/aserto-spa-js'

export type AsertoClient = {
  token: string,
  endpoint: string,
  service: string,
  reload: (headers: any) => void,
  displayStateMap: () => string | unknown
  getDisplayState: (method: string, path: string) => string | unknown
}

interface DefaultDisplayState {
  visible?: boolean,
  enabled?: boolean
}

export type InitOptions = {
  serviceUrl?: string,
  endpointName?: string,
  accessToken: string,
  throwOnError?: boolean,
  defaultDisplayState?: {
    visible?: boolean,
    enabled?: boolean
  }
}

export const AsertoContext = React.createContext(null)
export const useAserto = () => useContext(AsertoContext)
export const AsertoProvider = ({
  children
}) => {
  const [asertoClient, setAsertoClient] = useState<AsertoClient>()
  const [loading, setLoading] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState()

  const [displayStateMap, setDisplayStateMap] = useState<string | unknown>()
  const [identity, setIdentity] = useState()
  const [throwOnError, setThrowOnError] = useState(true)
  const [defaultDisplayState, setDefaultDisplayState] = useState<DefaultDisplayState>({
    visible: false,
    enabled: false
  })

  const init = async (initOptions: InitOptions) => {
    try {
      if (initOptions && initOptions.throwOnError == false) {
        setThrowOnError(false)
      }
      if (initOptions && initOptions.defaultDisplayState) {
        setDefaultDisplayState(initOptions.defaultDisplayState)
      }
      setLoading(true)
      const asertoFromHook = await createAsertoClient(initOptions)
      setAsertoClient(asertoFromHook)
      setDisplayStateMap(asertoFromHook.displayStateMap())
      setIsLoaded(true)
      setLoading(false)
    } catch (error) {
      setError(error.message)
      setIsLoaded(false)
      setLoading(false)
      if (!initOptions || initOptions.throwOnError) {
        throw error
      }
    }
  }

  const reload = async (headers) => {
    try {
      if (asertoClient) {
        setLoading(true)
        if (identity) {
          if (headers) {
            headers.identity = identity
          } else {
            headers = { identity }
          }
        }
        await asertoClient.reload(headers)
        setDisplayStateMap(asertoClient.displayStateMap())
        setLoading(false)
      }
    } catch (error) {
      if (throwOnError) {
        throw error
      }
      console.error(error)
      setError(error)
      setIsLoaded(false)
      setLoading(false)
    }
  }

  const getDisplayState = (method: string, path: string) => {
    try {
      if (asertoClient && method) {
        return asertoClient.getDisplayState(method, path)
      }

      // no client or path
      if (throwOnError) {
        if (!asertoClient) {
          throw new Error('aserto-react: must call init() before getDisplayState()')
        }
        if (!method) {
          throw new Error('aserto-react: missing required parameter')
        }
      } else {
        // return the default display state
        return defaultDisplayState
      }
    } catch (error) {
      if (throwOnError) {
        throw error
      }
      console.error(error)
      setError(error)
      setIsLoaded(false)
      setLoading(false)
    }
  }

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
  )
}