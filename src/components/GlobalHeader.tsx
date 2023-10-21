import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Layout, theme, Menu, Typography, Button } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { useIsMobile } from '../use';
import { MenuOutlined } from '@ant-design/icons';
import ToggleDarkMode from './ToggleDarkMode';
import ExitButton from './ExitButton';

const { Header } = Layout;

const CustomHeaderMobile = styled(Header)`
  display: flex;
  justify-content: space-between;
  padding-inline: 2em;
  align-items: center;
`;

const Logo = styled.div`
  float: left;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  h1 {
    color: #fff;
    font-size: 2em;
    margin: 0;
  }
`;

const Bookmarks = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 0 0.5em;

  button {
    margin: 0 0.2rem;
  }
`;

interface GlobalHeaderProps {
  title: string;
  children?: React.ReactNode;
  onMenuActive?: (state: boolean) => void;
  itemsNav?: Array<any>;
}

const GlobalHeader = ({
  title,
  children,
  itemsNav,
  onMenuActive
}: GlobalHeaderProps): React.ReactElement => {
  const [currentPathname, setCurrentPathname] = useState<string>('');
  const location = useLocation();
  const isMobile = useIsMobile();
  const [menuActived, setMenuActived] = useState<boolean>(false);

  const { token } = theme.useToken();

  useEffect(() => {
    setCurrentPathname(location.pathname);
    setMenuActived(false);
  }, [location]);

  useEffect(() => {
    if (onMenuActive !== undefined) {
      onMenuActive(menuActived);
    }
  }, [menuActived]);

  if (isMobile) {
    const renderButtonMenu = () => {
      return !menuActived ? (
        <Button
          type="default"
          ghost
          onClick={() => setMenuActived(true)}
          style={{
            color: token.colorTextBase,
            borderColor: token.colorTextBase
          }}
          icon={<MenuOutlined />}
        />
      ) : (
        <Button
          type="default"
          onClick={() => setMenuActived(false)}
          icon={<MenuOutlined />}
        />
      );
    };

    return (
      <CustomHeaderMobile>
        <Logo>
          <Link to={'/'}>
            <Typography.Title level={1} style={{ color: token.colorTextBase }}>
              {title}
            </Typography.Title>
          </Link>
        </Logo>
        {renderButtonMenu()}
      </CustomHeaderMobile>
    );
  }

  return (
    <Header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1,
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        padding: '0'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100vw',
          padding: '0 1em'
        }}
      >
        <Logo
          style={{
            width: '200px'
          }}
        >
          <Link to={'/'}>
            <Typography.Title level={1} style={{ color: token.colorTextBase }}>
              {title}
            </Typography.Title>
          </Link>
        </Logo>
        <div
          style={{
            flex: 2
          }}
        >
          {children}
        </div>
        <Menu
          mode="horizontal"
          items={itemsNav}
          selectedKeys={[currentPathname]}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end'
          }}
        />
        <Bookmarks>
          <ExitButton />
          <ToggleDarkMode />
        </Bookmarks>
      </div>
    </Header>
  );
};

export default GlobalHeader;
