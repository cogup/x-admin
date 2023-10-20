import React, { useState, useEffect } from 'react';
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate
} from 'react-router-dom';
import ListItems from './components/ListItems';
import ItemForm from './components/ItemForm';
import ItemView from './components/ItemView';
import Mosaico from './components/Mosaico';
import {
  Layout,
  theme,
  Breadcrumb,
  Menu as Navbar,
  ConfigProvider,
  Typography,
  notification,
  Button
} from 'antd';
import { LoadingOutlined, MenuOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import MenuGroups from './components/Sidebar';
import { type Controller, ControllerBuilder } from './controller';
import Search from './components/Search';
import { type Resource, ResourceTypes } from './controller/resources';
import locale from 'antd/locale/pt_BR';
import Swagger from './components/Swagger';
import { useIsMobile } from './use';

const { Content: ContentLayout, Header } = Layout;

const LoadingPage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
`;

const CustomHeader = styled(Header)`
  display: flex;
  justify-content: flex-start;
  padding-inline: 2em;
`;

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

const Root = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;

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

  &.isMobile {
    .ant-breadcrumb {
      padding: 0 1rem;
    }
  }
`;

interface ContentProps {
  background?: boolean;
  children: React.ReactNode;
}

const customTheme = {
  token: {
    borderRadiusLG: 10
  }
};

const Content = ({
  children,
  background
}: ContentProps): React.ReactElement => {
  return (
    <ContentLayout
      style={{
        padding: 24,
        minHeight: 'auto',
        marginBottom: 24,
        borderRadius: customTheme.token.borderRadiusLG,
        backgroundColor: background ? '#fff' : 'transparent'
      }}
    >
      {children}
    </ContentLayout>
  );
};

const Admin = (): React.ReactElement => {
  const [controller, setController] = useState<Controller>();
  const [breadcrumb, setBreadcrumb] = useState<string[]>([]);
  const [currentPathname, setCurrentPathname] = useState<string>('');
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [menuActived, setMenuActived] = useState<boolean>(false);

  const {
    token: { colorWhite }
  } = theme.useToken();

  useEffect(() => {
    setCurrentPathname(location.pathname);
    setMenuActived(false);
  }, [location]);

  useEffect(() => {
    fetchApiData().catch((err) => {
      notification.error(err);
    });
  }, []);

  useEffect(() => {
    if (controller === undefined) {
      setBreadcrumb([]);
      return;
    }

    const { pathname } = location;
    const resource = controller.getCurrentResource(pathname);
    if (resource !== undefined && resource !== null) {
      const typeName =
        resource.type.charAt(0).toUpperCase() + resource.type.slice(1);
      setBreadcrumb([resource.label, typeName]);
    } else {
      setBreadcrumb([]);
    }
  }, [location, controller]);

  const fetchApiData = async (): Promise<void> => {
    const specification = localStorage.getItem('specification') as string;
    const control = new ControllerBuilder({
      specification
    });

    const controller = await control.builder();

    setController(controller);
  };

  if (controller == null) {
    return (
      <LoadingPage>
        <LoadingOutlined style={{ fontSize: 60 }} />
      </LoadingPage>
    );
  }

  const getTemplate = (
    resource: Resource,
    controller: Controller
  ): React.ReactNode => {
    switch (resource.type) {
      case ResourceTypes.LIST:
        return <ListItems resource={resource} controller={controller} />;
      case ResourceTypes.SEARCH:
        return <ListItems resource={resource} controller={controller} />;
      case ResourceTypes.UPDATE:
        return (
          <ItemForm
            resource={resource}
            controller={controller}
            type={ResourceTypes.UPDATE}
            throwDown={['createdAt', 'updatedAt']}
            throwUp={[resource.metadata?.id]}
          />
        );
      case ResourceTypes.CREATE:
        return (
          <ItemForm
            resource={resource}
            controller={controller}
            type={ResourceTypes.CREATE}
            hidden={[resource.metadata?.id, 'createdAt', 'updatedAt']}
          />
        );
      case ResourceTypes.READ:
        return <ItemView resource={resource} controller={controller} />;
      default:
        return null;
    }
  };

  const renderRoutes = (): React.ReactNode[] => {
    const routes: React.ReactElement[] = [
      <Route
        key="home"
        path="/"
        element={
          <Content background={false}>
            <Mosaico controller={controller} />
          </Content>
        }
      />,
      <Route
        key="docs"
        path="/docs"
        element={
          <Content background={true}>
            <Swagger controller={controller} />
          </Content>
        }
      />
    ];

    const allResources = controller.getAllResources();

    allResources.forEach((resource) => {
      const path = resource.getLocalPath();
      routes.push(
        <Route
          key={path}
          path={path}
          element={
            <Content background={true}>
              {getTemplate(resource, controller)}
            </Content>
          }
        />
      );
    });

    // const steps = controller.getSteps();

    // Object.keys(steps).forEach((path) => {
    //   routes.push(
    //     <Route
    //       key={path}
    //       path={path}
    //       element={<StepsMaker steps={steps[path]} controller={controller} />}
    //     />
    //   );
    // });

    return routes;
  };

  const gotToBreadcrumb = (path: string): any => {
    return (e: any): void => {
      e.preventDefault();
      navigate(path);
    };
  };

  const renderBreadcrumb = (): React.ReactNode | null => {
    if (breadcrumb == null || breadcrumb.length === 0) {
      return null;
    }

    const resourceList = controller.getResourceSafe(
      breadcrumb[0].toLowerCase(),
      ResourceTypes.LIST
    );

    if (resourceList === null) {
      return null;
    }

    const others = breadcrumb.slice(1);

    const items = [
      {
        key: 'home',
        title: 'Admin',
        onClick: gotToBreadcrumb('/'),
        path: ''
      },
      {
        key: breadcrumb[0],
        title: breadcrumb[0],
        onClick: gotToBreadcrumb(resourceList.getLocalPath()),
        path: ''
      }
    ];

    others.forEach((item) => {
      items.push({
        key: item,
        title: item,
        onClick: () => {},
        path: ''
      });
    });

    return (
      <Breadcrumb
        style={{ margin: '16px 0', cursor: 'pointer' }}
        items={items}
      />
    );
  };

  const itemsNav = [
    {
      label: 'Docs',
      key: '/docs',
      onClick: () => {
        navigate('/docs');
      }
    },
    {
      label: 'Exit',
      key: '/exit',
      onClick: () => {
        localStorage.removeItem('specification');
        window.location.href = '/';
      }
    }
  ];

  if (isMobile) {
    const renderButtonMenu = () => {
      return !menuActived ? (
        <Button
          type="default"
          ghost
          onClick={() => setMenuActived(true)}
          style={{ color: colorWhite, borderColor: colorWhite }}
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
      <Root className={'isMobile'}>
        <Layout
          style={{
            height: '100vh',
            overflow: 'hidden'
          }}
        >
          <CustomHeaderMobile>
            <Logo>
              <Link to={'/'}>
                <Typography.Title level={1} style={{ color: colorWhite }}>
                  {controller.apiAdmin.info.title}
                </Typography.Title>
              </Link>
            </Logo>
            {renderButtonMenu()}
          </CustomHeaderMobile>
          <Layout
            style={{
              height: '100%',
              backgroundColor: '#001529',
              flexDirection: 'column',
              width: '100%'
            }}
          >
            {menuActived ? (
              <MenuGroups controller={controller} aditionalItems={itemsNav} />
            ) : (
              <Layout
                style={{
                  padding: '0',
                  overflow: 'auto',
                  borderRadius: customTheme.token.borderRadiusLG
                }}
              >
                {renderBreadcrumb()}
                <Routes>{renderRoutes()}</Routes>
              </Layout>
            )}
          </Layout>
        </Layout>
      </Root>
    );
  }

  return (
    <Root>
      <Layout style={{ height: '100vh', overflow: 'hidden' }}>
        <CustomHeader>
          <Logo>
            <Link to={'/'}>
              <Typography.Title level={1} style={{ color: colorWhite }}>
                {controller.apiAdmin.info.title}
              </Typography.Title>
            </Link>
          </Logo>
          <Search controller={controller} />
          <Navbar
            theme="dark"
            mode="horizontal"
            items={itemsNav}
            selectedKeys={[currentPathname]}
          />
        </CustomHeader>
        <Layout style={{ height: '100%', backgroundColor: '#001529' }}>
          <MenuGroups controller={controller} />
          <Layout
            style={{
              padding: '0 2rem',
              overflow: 'auto',
              borderRadius: customTheme.token.borderRadiusLG
            }}
          >
            {renderBreadcrumb()}
            <Routes>{renderRoutes()}</Routes>
          </Layout>
        </Layout>
      </Layout>
    </Root>
  );
};

export default Admin;
