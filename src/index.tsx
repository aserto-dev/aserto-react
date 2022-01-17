import React, { useCallback, useContext, useMemo, useState } from 'react'
import createAsertoClient from '@aserto/aserto-spa-js'

export type AsertoClient = {
  token: string
  endpoint: string
  service: URL
  reload: (body?: any, headers?: any) => Promise<void>
  displayStateMap: () => unknown
  getDisplayState: (method: string, path?: string, policyRoot?: string) => unknown
}

interface DefaultDisplayState {
  visible?: boolean
  enabled?: boolean
}

export type InitOptions = {
  serviceUrl?: URL
  endpointName?: string
  accessToken: string
  throwOnError?: boolean
  policyRoot?: string
  defaultDisplayState?: {
    visible?: boolean
    enabled?: boolean
  }
}

export const AsertoContext = React.createContext(null)
export const useAserto = () => useContext(AsertoContext)
export const AsertoProvider = ({ children }) => {
  const [asertoClient, setAsertoClient] = useState<AsertoClient>()
  const [loading, setLoading] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState()

  const [displayStateMap, setDisplayStateMap] = useState<unknown>()
  const [identity, setIdentity] = useState()
  const [throwOnError, setThrowOnError] = useState(true)
  const [defaultDisplayState, setDefaultDisplayState] = useState<DefaultDisplayState>({
    visible: false,
    enabled: false,
  })

  const init = useCallback(async (initOptions: InitOptions, body?: any) => {
    try {
      if (initOptions && initOptions.throwOnError == false) {
        setThrowOnError(false)
      }
      if (initOptions && initOptions.defaultDisplayState) {
        setDefaultDisplayState(initOptions.defaultDisplayState)
      }
      setLoading(true)
      const asertoFromHook = await createAsertoClient(initOptions, body)
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
  }, [])

  const reload = useCallback(
    async (body?: any, headers?: any) => {
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
          await asertoClient.reload(body, headers)
          setDisplayStateMap(asertoClient.displayStateMap())
          setLoading(false)
        }
      } catch (error) {
        if (throwOnError) {
          throw error
        }
        setError(error)
        setIsLoaded(false)
        setLoading(false)
      }
    },
    [asertoClient, throwOnError, identity]
  )

  const getDisplayState = useCallback(
    (method: string, path?: string, policyRoot?: string) => {
      try {
        if (asertoClient && method) {
          return asertoClient.getDisplayState(method, path, policyRoot)
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
        setError(error)
        setIsLoaded(false)
        setLoading(false)
      }
    },
    [asertoClient, defaultDisplayState, throwOnError]
  )

  const value = useMemo(
    () => ({
      loading,
      displayStateMap,
      init,
      reload,
      getDisplayState,
      isLoaded,
      identity,
      setIdentity,
      error,
    }),
    [displayStateMap, error, getDisplayState, identity, init, isLoaded, loading, reload]
  )

  return <AsertoContext.Provider value={value}>{children}</AsertoContext.Provider>
}
