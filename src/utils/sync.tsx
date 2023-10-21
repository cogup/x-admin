import React, { createContext, useContext, useState } from 'react';
import { OpenAPI } from '../controller/openapi';

const defaultValue: DataSyncContextData = {
  darkMode: false,
  backgroundColor: false,
  backgroundGradient: true
};

export interface DataSyncContextData {
  darkMode: boolean;
  specification?: OpenAPI;
  backgroundImage?: string;
  backgroundGradient?: boolean;
  backgroundColor?: boolean;
}

interface DataSyncContextType {
  data: DataSyncContextData;
  updateData: (newData: DataSyncContextData) => void;
}

const DataSyncContext = createContext<DataSyncContextType>({
  data: defaultValue,
  updateData: (newData: DataSyncContextData): void => {
    console.warn('updateData not implemented');
  }
});

interface DataSyncProviderProps {
  children: React.ReactNode;
}

// 2. Crie um provedor de contexto que irá manter os dados compartilhados
export function DataSyncProvider({ children }: DataSyncProviderProps) {
  const valueLoaded: DataSyncContextData =
    localStorage.getItem('sync') !== null
      ? JSON.parse(localStorage.getItem('sync') as string)
      : defaultValue;
  const [data, setData] = useState(valueLoaded);

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