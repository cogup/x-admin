import React from 'react';
import { ConfigProvider } from 'antd';
import Setup from './setup/Setup';
import Admin from './Admin';

const customTheme = {
  token: {
    borderRadiusLG: 10
  }
};

const App = (): React.ReactElement => {
  const specification = localStorage.getItem('specification');

  return (
    <ConfigProvider theme={customTheme}>
      {specification === null ? <Setup /> : <Admin />}
    </ConfigProvider>
  );
};

export default App;
