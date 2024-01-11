/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getApiKey } from '$/server/process';
import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';


type ApiKeyType = string|undefined;

const ApiKeyContext = createContext<ApiKeyType | undefined>(undefined);

// Create a provider context
interface ApiKeyProviderProps {
    children: ReactNode;
}

const apiKey = getApiKey();

const ApiKeyProvider: React.FC<ApiKeyProviderProps> = ({ children }) => {

    return <ApiKeyContext.Provider value={apiKey}>{children}</ApiKeyContext.Provider>;
};

const useApiKey = (): ApiKeyType => {
    const apiKey = useContext(ApiKeyContext);
    
    if (apiKey === undefined) {
      throw new Error("La clé API n'est pas disponible. Assurez-vous que le fournisseur de contexte est correctement configuré.");
    }
    return apiKey;
  };
  
  export { ApiKeyProvider, useApiKey };
