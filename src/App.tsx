import React, { useEffect } from 'react';
import { ConfigProvider, GlobalToken, theme } from 'antd';
import Setup from './views/Setup';
import Admin from './views/Admin';
import { DataSyncContextData, useDataSync } from './utils/sync';
import styled from 'styled-components';
import Glass from './ui/Glass';

interface RootProps {
  colorPrimary: string;
  backgroundImage?: string;
  backgroundGradient?: boolean;
  backgroundColor?: boolean;
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

  ${({
    colorPrimary,
    backgroundImage,
    backgroundGradient,
    backgroundColor
  }) => {
    if (backgroundImage) {
      return `
      background: url(${backgroundImage});
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      background-attachment: fixed;
      `;
    }

    if (backgroundGradient || backgroundColor) {
      return `
      background: ${colorPrimary};
    `;
    }
  }}

  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
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

const defineColorBgLayoutDark = (
  data: DataSyncContextData,
  token: GlobalToken
) => {
  if (data.backgroundImage) {
    return 'transparent';
  }

  if (data.backgroundGradient) {
    return 'transparent';
  }

  return '#0f0f0f';
};

const App = (): React.ReactElement => {
  const { data } = useDataSync();

  const { token } = theme.useToken();

  const customThemeDark = {
    token: {
      colorBgLayout: defineColorBgLayoutDark(data, token),
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

  const [customTheme, setCustomTheme] = React.useState(
    data.darkMode ? customThemeDark : customThemeLight
  );

  useEffect(() => {
    setCustomTheme(data.darkMode ? customThemeDark : customThemeLight);
  }, [data]);

  return (
    <Root
      colorPrimary={token.colorPrimary}
      backgroundImage={data.backgroundImage}
      backgroundGradient={data.backgroundGradient}
      backgroundColor={data.backgroundColor}
    >
      {data.backgroundImage || data.backgroundGradient ? (
        <Glass
          darkMode={data.darkMode}
          backgroundGradient={data.backgroundGradient}
          backgroundUrl={data.backgroundImage !== undefined}
        >
          <ConfigProvider theme={customTheme}>
            {data.specification === undefined ? <Setup /> : <Admin />}
          </ConfigProvider>
        </Glass>
      ) : (
        <ConfigProvider theme={customTheme}>
          {data.specification === undefined ? <Setup /> : <Admin />}
        </ConfigProvider>
      )}
    </Root>
  );
};

export default App;
