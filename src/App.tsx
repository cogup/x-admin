import React, { useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';
import Setup from './views/Setup';
import Admin from './views/Admin';
import { useDataSync } from './utils/sync';
import styled from 'styled-components';

const Root = styled.div`
  .ant-menu-light.ant-menu-root.ant-menu-inline {
    border-right: none;
  }

  .ant-menu-horizontal {
    border-bottom: none;
  }
`;

const { defaultAlgorithm, darkAlgorithm } = theme;

const App = (): React.ReactElement => {
  const { data } = useDataSync();
  const [customTheme, setCustomTheme] = React.useState({
    components: {
      Layout: {
        siderBg: 'transparent',
        headerBg: 'transparent'
      },
      Menu: {
        subMenuItemBg: 'transparent',
        itemBg: 'transparent'
      }
    },
    algorithm: defaultAlgorithm
  });

  useEffect(() => {
    const algorithm = data.darkMode ? darkAlgorithm : defaultAlgorithm;
    setCustomTheme({ ...customTheme, algorithm });
  }, [data]);

  return (
    <Root>
      <ConfigProvider theme={customTheme}>
        {data.specification === undefined ? <Setup /> : <Admin />}
      </ConfigProvider>
    </Root>
  );
};

export default App;
