import React from 'react';
import { DataSyncProvider } from './utils/sync';
import App from './App';

const AppSync = (): React.ReactElement => {
  return (
    <DataSyncProvider>
      <App />
    </DataSyncProvider>
  );
};

export default AppSync;
