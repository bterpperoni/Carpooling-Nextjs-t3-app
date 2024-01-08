import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { env } from 'next.config';


type ApiKeyType = string|undefined;

const ApiKeyContext = createContext<ApiKeyType | undefined>(undefined);

// Créez un fournisseur de contexte
interface ApiKeyProviderProps {
    children: ReactNode;
}

const ApiKeyProvider: React.FC<ApiKeyProviderProps> = ({ children }) => {

    const apiKey: ApiKeyType = env.GOOGLE_MAPS_API_KEY;

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
