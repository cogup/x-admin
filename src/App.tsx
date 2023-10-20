import React from 'react';
import { Layout, ConfigProvider } from 'antd';
import Setup from './setup/Setup';
import Admin from './Admin';
// import locale from 'antd/locale/pt_BR';

const customTheme = {
  token: {
    borderRadiusLG: 10
  }
};

const App = (): React.ReactElement => {
  const onDone = (data: any) => {
    localStorage.setItem('specification', JSON.stringify(data.xAdmin));
  };

  const specification = localStorage.getItem('specification');

  return (
    <ConfigProvider theme={customTheme}>
      {specification === null ? <Setup /> : <Admin />}
    </ConfigProvider>
  );
};

export default App;
