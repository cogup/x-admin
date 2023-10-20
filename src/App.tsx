import React, { useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';
import Setup from './setup/Setup';
import Admin from './Admin';
import { useDataSync } from './utils/sync';

const { defaultAlgorithm, darkAlgorithm } = theme;

const App = (): React.ReactElement => {
  const { data } = useDataSync();
  const [customTheme, setCustomTheme] = React.useState({
    token: {
      borderRadiusLG: 10
    },
    algorithm: defaultAlgorithm
  });

  useEffect(() => {
    const algorithm = data.darkMode ? darkAlgorithm : defaultAlgorithm;
    setCustomTheme({ ...customTheme, algorithm });
  }, [data]);

  return (
    <ConfigProvider theme={customTheme}>
      {data.specification === undefined ? <Setup /> : <Admin />}
    </ConfigProvider>
  );
};

export default App;
