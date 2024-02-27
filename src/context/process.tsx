/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';


type ApiKeyType = string|undefined;

// Create a provider context
const ApiKeyContext = createContext<ApiKeyType | undefined>(undefined);

interface ApiKeyProviderProps {
    children: ReactNode;
}

const apiKey = process.env.GOOGLE_MAPS_API_KEY;

const ApiKeyProvider: React.FC<ApiKeyProviderProps> = ({ children }) => {

    return <ApiKeyContext.Provider value={apiKey}>{children}</ApiKeyContext.Provider>;
};

const useApiKey = (): ApiKeyType => {
    const apiKey = useContext(ApiKeyContext);
    
    if (apiKey === undefined) {
      throw new Error("useApiKey must be used within a ApiKeyProvider");
    }
    return apiKey;
  };
  
  export { ApiKeyProvider, useApiKey };
