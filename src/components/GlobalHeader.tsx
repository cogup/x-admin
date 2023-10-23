import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Layout, theme, Menu, Typography, Button } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { useIsMobile } from '../use';
import { MenuOutlined } from '@ant-design/icons';
import ToggleDarkMode from './ToggleDarkMode';
import ExitButton from './ExitButton';
import Logo from '../assets/Logo';

const CustomHeader = styled(Layout.Header)`
  transition:
    backdrop-filter 0.6s,
    box-shadow 0.6s;

  background: linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
  backdrop-filter: blur(5px);
  box-shadow: 0 0px 10px 0 rgba(0, 0, 0, 0.1);

  &.overlap {
    backdrop-filter: blur(5px) opacity(100%);
    box-shadow: 0 0px 10px 0 rgba(0, 0, 0, 0.1);
  }
`;

const CustomHeaderMobile = styled(Layout.Header)`
  display: flex;
  justify-content: space-between;
  padding-inline: 2em;
  align-items: center;
`;

const LogoWrapper = styled.div`
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
  contentRef?: React.RefObject<HTMLDivElement>;
}

const GlobalHeader = ({
  title,
  children,
  itemsNav,
  onMenuActive,
  contentRef
}: GlobalHeaderProps): React.ReactElement => {
  const [currentPathname, setCurrentPathname] = useState<string>('');
  const location = useLocation();
  const isMobile = useIsMobile();
  const [menuActived, setMenuActived] = useState<boolean>(false);
  const [overlapClass, setOverlapClass] = useState<string>('');

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

  useEffect(() => {
    if (contentRef === undefined || contentRef.current === null) {
      return;
    }

    const handleScroll = () => {
      const scrollTop = contentRef.current?.scrollTop || 0;

      if (scrollTop > 25) {
        setOverlapClass('overlap');
      } else {
        setOverlapClass('');
      }
    };

    contentRef.current?.addEventListener('scroll', handleScroll);

    return () => {
      contentRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, [contentRef?.current]);

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
        <LogoWrapper>
          <Link to={'/'}>
            <Typography.Title level={1} style={{ color: token.colorTextBase }}>
              {title}
            </Typography.Title>
          </Link>
        </LogoWrapper>
        {renderButtonMenu()}
      </CustomHeaderMobile>
    );
  }

  return (
    <CustomHeader
      className={overlapClass}
      style={{
        position: 'fixed',
        top: 0,
        zIndex: 1,
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        padding: '0',
        height: 63
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
        <LogoWrapper
          style={{
            maxWidth: '200px',
            paddingLeft: '1em'
          }}
        >
          <Link
            to={'/admin'}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'center'
            }}
          >
            <Logo
              color={token.colorTextBase}
              style={{
                width: '20px',
                height: '20px',
                // marginRight: '7px'
                // marginTop: '-5px'
                marginBottom: 5,
                marginTop: 15
              }}
            />
            <Typography.Title
              level={1}
              style={{
                color: token.colorTextBase,
                fontSize: '1rem',
                fontFamily: 'monospace',
                verticalAlign: 'middle'
              }}
            >
              {title}
            </Typography.Title>
          </Link>
        </LogoWrapper>
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
    </CustomHeader>
  );
};

export default GlobalHeader;
