import React, { createContext, useContext, useState } from 'react';
import { OpenAPI } from '../controller/openapi';

export interface GlobarVars extends Window, DataSyncContextData {}

// add themes, light, darker, lighting and dark
export enum Theme {
  LIGHT = 'light',
  LIGHTING = 'lighting',
  DARKER = 'darker',
  DARK = 'dark'
}

export enum DataType {
  SPECIFICATION = 'specification',
  SPECIFICATION_URL = 'specificationUrl',
  BACKGROUND_IMAGE = 'backgroundImage',
  PRIMARY_COLOR = 'primaryColor',
  THEME = 'theme',
  DARK_MODE = 'darkMode'
}

const defaultData: DataSyncContextData = {
  darkMode: (window as GlobarVars).darkMode ?? false,
  theme: (window as GlobarVars).theme ?? Theme.DARK,
  primaryColor: (window as GlobarVars).primaryColor ?? '#0065c4',
  specification: (window as GlobarVars).specification,
  specificationUrl: (window as GlobarVars).specificationUrl,
  backgroundImage: (window as GlobarVars).backgroundImage
};

export interface DataSyncContextData {
  darkMode?: boolean;
  specification?: OpenAPI;
  specificationUrl?: string;
  backgroundImage?: string;
  primaryColor?: string;
  theme?: Theme;
}

interface DataSyncContextType {
  data: DataSyncContextData;
  updateData: (key: DataType, value: any) => void;
  updateAllData: (newData: DataSyncContextData) => void;
  removeData: (key: DataType) => void;
}

const DataSyncContext = createContext<DataSyncContextType>({
  data: defaultData,
  updateData: (_: string, __: any): void => {
    console.warn('updateData not implemented');
  },
  updateAllData: (_: DataSyncContextData): void => {
    console.warn('updateData not implemented');
  },
  removeData: (_: string): void => {
    console.warn('removeData not implemented');
  }
});

function getLocalData<T>(key: string): T | undefined {
  const data = localStorage.getItem(key);

  try {
    if (data) {
      return JSON.parse(data) as T;
    }
  } catch {}

  return undefined;
}

interface DataSyncProviderProps {
  children: React.ReactNode;
}

const saveLocalData = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const getAllData = (): DataSyncContextData => {
  const theme = getLocalData<Theme>('theme');
  const darkMode = getLocalData<boolean>('darkMode') || false;
  const specification = getLocalData<OpenAPI>('specification');
  const specificationUrl = getLocalData<string>('specificationUrl');
  const backgroundImage = getLocalData<string>('backgroundImage');
  const primaryColor = getLocalData<string>('primaryColor');

  return {
    theme,
    darkMode,
    specification,
    specificationUrl,
    backgroundImage,
    primaryColor
  };
};

// 2. Crie um provedor de contexto que irá manter os dados compartilhados
export function DataSyncProvider({ children }: DataSyncProviderProps) {
  const [data, setData] = useState(getAllData());

  // Função para atualizar os dados
  const updateData = (key: DataType, value: any) => {
    setData((prevData) => {
      const newData = { ...prevData, [key]: value };
      saveLocalData(key, value);
      return newData;
    });
  };

  const updateAllData = (newData: DataSyncContextData) => {
    setData(newData);
    Object.entries(newData).forEach(([key, value]) => {
      saveLocalData(key, value);
    });
  };

  const removeData = (key: DataType) => {
    setData((prevData) => {
      const newData = { ...prevData };
      delete newData[key];
      localStorage.removeItem(key);
      return newData;
    });
  };

  return (
    <DataSyncContext.Provider
      value={{
        data,
        updateData,
        updateAllData,
        removeData
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
