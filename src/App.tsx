import React, { useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';
import Setup from './views/Setup';
import Admin from './views/Admin';
import { useDataSync } from './utils/sync';
import styled from 'styled-components';

interface RootProps {
  colorPrimary: string;
}

const Root = styled.div<RootProps>`
  .ant-menu-light.ant-menu-root.ant-menu-inline {
    border-right: none;
  }

  .ant-menu-horizontal {
    border-bottom: none;
  }

  section {
    opacity: 1;
    animation: fadeInSteps 0.6s forwards;
  }

  @keyframes fadeInSteps {
    0% {
      opacity: 0;
      transform: scale(1.01);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  background: url(https://images.unsplash.com/photo-1485470733090-0aae1788d5af?auto=format&fit=crop&q=80&w=1817&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;

  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
`;

interface GlassProps {
  color?: string;
}

const Glass = styled.div<GlassProps>`
  backdrop-filter: blur(5px);
  width: 100%;
  height: 100%;

  ${({ color }) =>
    color
      ? `
     background: linear-gradient(
        135deg,
        rgba(${color}, 1) 0%,
        rgba(${color}, 0) 100%
      ) !important;
  `
      : null}
`;

const { defaultAlgorithm, darkAlgorithm } = theme;

const customThemeLight = {
  token: {
    colorBgLayout: 'transparent',
    colorBgContainer: 'rgba(255, 255, 255, 0.9)'
  },
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
};

const customThemeDark = {
  token: {
    colorBgLayout: 'transparent',
    colorBgContainer: 'rgba(22, 22, 22, 0.95)'
  },
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
  algorithm: darkAlgorithm
};

const App = (): React.ReactElement => {
  const { data } = useDataSync();

  const { token } = theme.useToken();

  const [customTheme, setCustomTheme] = React.useState(
    data.darkMode ? customThemeDark : customThemeLight
  );

  useEffect(() => {
    setCustomTheme(data.darkMode ? customThemeDark : customThemeLight);
  }, [data]);

  return (
    <Root colorPrimary={token.colorPrimary}>
      <Glass color={data.darkMode ? '0, 0, 0' : '255, 255, 255'}>
        <ConfigProvider theme={customTheme}>
          {data.specification === undefined ? <Setup /> : <Admin />}
        </ConfigProvider>
      </Glass>
    </Root>
  );
};

export default App;
