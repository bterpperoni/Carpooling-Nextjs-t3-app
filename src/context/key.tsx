/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getApiKey } from '$/server/key';
import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';


type ApiKeyType = string|undefined;

const ApiKeyContext = createContext<ApiKeyType | undefined>(undefined);

// Créez un fournisseur de contexte
interface ApiKeyProviderProps {
    children: ReactNode;
}

const ApiKeyProvider: React.FC<ApiKeyProviderProps> = ({ children }) => {

    const apiKey: ApiKeyType = getApiKey();

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
