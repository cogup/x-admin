import React, { createContext, useContext, useState } from 'react';
import { OpenAPI } from '../controller/openapi';

// add themes, light, darker, lighting and dark
export enum Theme {
  LIGHT = 'light',
  LIGHTING = 'lighting',
  DARKER = 'darker',
  DARK = 'dark'
}

const defaultData: DataSyncContextData = {
  darkMode: false,
  theme: Theme.DARKER
};

export interface DataSyncContextData {
  darkMode: boolean;
  specification?: OpenAPI;
  backgroundImage?: string;
  backgroundGradient?: boolean;
  backgroundColor?: boolean;
  primaryColor?: string;
  theme?: Theme;
}

interface DataSyncContextType {
  data: DataSyncContextData;
  updateData: (newData: DataSyncContextData) => void;
}

const DataSyncContext = createContext<DataSyncContextType>({
  data: defaultData,
  updateData: (newData: DataSyncContextData): void => {
    console.warn('updateData not implemented');
  }
});

interface DataSyncProviderProps {
  children: React.ReactNode;
}

// 2. Crie um provedor de contexto que irá manter os dados compartilhados
export function DataSyncProvider({ children }: DataSyncProviderProps) {
  const dataLoaded =
    localStorage.getItem('sync') !== null
      ? {
          ...defaultData,
          ...JSON.parse(localStorage.getItem('sync') as string)
        }
      : defaultData;

  const [data, setData] = useState(dataLoaded);

  // Função para atualizar os dados
  const updateData = (newData: DataSyncContextData) => {
    localStorage.setItem('sync', JSON.stringify(newData));
    setData(newData);
  };

  return (
    <DataSyncContext.Provider
      value={{
        data,
        updateData
      }}
    >
      {children}
    </DataSyncContext.Provider>
  );
}

export function useDataSync() {
  const context = useContext(DataSyncContext);

  if (!context) {
    throw new Error('useDataSync deve ser usado dentro de um DataSyncProvider');
  }
  return context;
}
