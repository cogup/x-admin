import React from 'react';
import { ConfigProvider, theme } from 'antd';
import Setup from './setup/Setup';
import Admin from './Admin';

const { defaultAlgorithm, darkAlgorithm } = theme;

const customTheme = {
  token: {
    borderRadiusLG: 10
  },
  algorithm: defaultAlgorithm
};

const App = (): React.ReactElement => {
  const darkMode = localStorage.getItem('darkMode');

  if (darkMode === 'true') {
    customTheme.algorithm = darkAlgorithm;
  } else if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    customTheme.algorithm = darkAlgorithm;
  } else {
    customTheme.algorithm = defaultAlgorithm;
  }

  const specification = localStorage.getItem('specification');

  return (
    <ConfigProvider theme={customTheme}>
      {specification === null ? <Setup /> : <Admin />}
    </ConfigProvider>
  );
};

export default App;
