import React, { useEffect } from 'react';
import { ConfigProvider, GlobalToken, theme } from 'antd';
import Setup from './views/Setup';
import Admin from './views/Admin';
import { DataSyncContextData, useDataSync } from './utils/sync';
import styled from 'styled-components';
import Glass from './ui/Glass';
import getThemes from './themes';

interface RootProps {
  colorBase?: string;
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

  *::-webkit-scrollbar {
    width: 0.5rem;
  }

  *::-webkit-scrollbar-track {
    background: transparent;
  }

  *::-webkit-scrollbar-thumb {
    background: ${({ colorBase }) => colorBase};
    border-radius: 0.5rem;
  }

  *::-webkit-scrollbar-thumb:hover {
    background: ${({ colorBase }) => colorBase};
  }
`;

const App = (): React.ReactElement => {
  const { data } = useDataSync();

  const themes = getThemes(data);

  console.log({
    theme: data.theme,
    themes
  });

  const [customTheme, setCustomTheme] = React.useState(
    data.darkMode ? themes.dark : themes.light
  );

  useEffect(() => {
    setCustomTheme(data.darkMode ? themes.dark : themes.light);
  }, [data]);

  return (
    <Root
      colorBase={customTheme.token.colorBgContainer}
      colorPrimary={customTheme.token.colorPrimary}
      backgroundImage={data.backgroundImage}
      backgroundGradient={data.backgroundGradient}
      backgroundColor={data.backgroundColor}
    >
      <Glass
        darkMode={data.darkMode}
        backgroundGradient={data.backgroundGradient}
        backgroundUrl={data.backgroundImage !== undefined}
        theme={data.theme}
      >
        <ConfigProvider theme={customTheme}>
          {data.specification === undefined ? <Setup /> : <Admin />}
        </ConfigProvider>
      </Glass>
    </Root>
  );
};

export default App;
