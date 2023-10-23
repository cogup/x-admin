import React, { useEffect } from 'react';
import { theme } from 'antd';
import Setup from './views/Setup';
import Admin from './views/Admin';
import { Theme, useDataSync } from './utils/sync';
import styled from 'styled-components';
import Glass from './ui/Glass';
import Theming from './components/Theming';
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate
} from 'react-router-dom';

interface RootProps {
  $colorBase?: string;
  $colorPrimary: string;
  $backgroundImage?: string;
  $backgroundGradient?: boolean;
  $backgroundColor?: boolean;
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
    $colorPrimary,
    $backgroundImage,
    $backgroundGradient,
    $backgroundColor
  }) => {
    if ($backgroundImage) {
      return `
      background: url(${$backgroundImage});
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      background-attachment: fixed;
      `;
    }

    if ($backgroundGradient || $backgroundColor) {
      return `
      background: ${$colorPrimary};
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
    background: ${({ $colorBase }) => $colorBase};
    border-radius: 0.5rem;
  }

  *::-webkit-scrollbar-thumb:hover {
    background: ${({ $colorBase }) => $colorBase};
  }
`;

const Inner = (): React.ReactElement => {
  const { data } = useDataSync();
  const { token } = theme.useToken();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/' && data.specification !== undefined) {
      navigate('/admin');
    } else if (location.pathname === '/' && data.specification === undefined) {
      navigate('/setup');
    }
  }, []);

  return (
    <Root
      $colorBase={token.colorBgContainer}
      $colorPrimary={token.colorPrimary}
      $backgroundImage={data.backgroundImage}
      $backgroundGradient={data.backgroundGradient}
      $backgroundColor={data.backgroundColor}
    >
      <Glass
        $darkMode={data.darkMode}
        $token={token}
        $theme={data.theme ?? Theme.LIGHT}
        $backgroundImage={data.backgroundImage !== undefined}
      >
        <Routes>
          {data.specification !== undefined ? (
            [
              <Route key={0} path="/admin" element={<Admin />} />,
              <Route key={1} path="/admin/*" element={<Admin />} />
            ]
          ) : (
            <Route path="/admin" element={<Navigate to="/setup" />} />
          )}
          <Route path="/setup" element={<Setup />} />
        </Routes>
      </Glass>
    </Root>
  );
};

const App = (): React.ReactElement => {
  return (
    <Theming internal={false}>
      <Inner />
    </Theming>
  );
};

export default App;
