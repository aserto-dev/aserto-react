import React from 'react';
export declare type AsertoClient = {
    token: string;
    endpoint: string;
    service: string;
    reload: (headers: any) => void;
    displayStateMap: () => string | unknown;
    getDisplayState: (method: string, path: string) => string | unknown;
};
export declare type InitOptions = {
    serviceUrl?: string;
    endpointName?: string;
    accessToken: string;
    throwOnError?: boolean;
    defaultDisplayState?: {
        visible?: boolean;
        enabled?: boolean;
    };
};
export declare const AsertoContext: React.Context<any>;
export declare const useAserto: () => any;
export declare const AsertoProvider: ({ children }: {
    children: any;
}) => JSX.Element;
