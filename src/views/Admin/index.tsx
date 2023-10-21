import React, { useState, useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import ListItems from './Content/ListItems';
import ItemForm from './Content/ItemForm';
import ItemView from './Content/ItemView';
import Mosaico from './Content/Mosaico';
import Content from './Content';
import Breadcrumb from '../../components/Breadcrumb';
import { Layout, theme, notification } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import MenuGroups from '../../components/Sidebar';
import { type Controller, ControllerBuilder } from '../../controller';
import Search from '../../components/Search';
import { type Resource, ResourceTypes } from '../../controller/resources';
import Swagger from './Content/Swagger';
import { useIsMobile } from '../../use';
import GlobalHeader from '../../components/GlobalHeader';
import { useDataSync } from '../../utils/sync';

const LoadingPage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
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

const Admin = (): React.ReactElement => {
  const { data } = useDataSync();
  const [controller, setController] = useState<Controller>();
  const [breadcrumb, setBreadcrumb] = useState<string[]>([]);
  const [menuActive, setMenuActive] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const { token } = theme.useToken();

  useEffect(() => {
    if (data.specification === undefined) {
      notification.error({
        message: 'Error',
        description: 'Specification not found'
      });
      return;
    }

    const control = new ControllerBuilder({
      specification: data.specification
    });

    const controller = control.builder();

    setController(controller);
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

    allResources.forEach((resource, index) => {
      const path = resource.getLocalPath();
      routes.push(
        <Route
          key={index}
          path={path}
          element={
            <Content background={true}>
              {getTemplate(resource, controller)}
            </Content>
          }
        />
      );
    });

    return routes;
  };

  const itemsNav = [
    {
      label: 'Docs',
      key: '/docs',
      onClick: () => {
        navigate('/docs');
      }
    }
  ];

  if (isMobile) {
    const onMenuActive = (active: boolean) => {
      setMenuActive(active);
    };

    return (
      <Root className={'isMobile'}>
        <Layout
          style={{
            height: '100vh',
            overflow: 'hidden'
          }}
        >
          <GlobalHeader
            title={controller.apiAdmin.info.title}
            onMenuActive={onMenuActive}
          />
          <Layout
            style={{
              height: '100%',
              backgroundColor: token.colorBgBase,
              flexDirection: 'column',
              width: '100%'
            }}
          >
            {menuActive ? (
              <MenuGroups controller={controller} aditionalItems={itemsNav} />
            ) : (
              <Layout
                style={{
                  padding: '0',
                  overflow: 'auto'
                }}
              >
                <Breadcrumb breadcrumb={breadcrumb} controller={controller} />
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
        <GlobalHeader
          title={controller.apiAdmin.info.title}
          itemsNav={itemsNav}
        >
          <Search controller={controller} />
        </GlobalHeader>
        <Layout style={{ height: '100%' }}>
          <MenuGroups controller={controller} />
          <Layout
            style={{
              padding: '0 2rem',
              overflow: 'auto'
            }}
          >
            <Breadcrumb breadcrumb={breadcrumb} controller={controller} />
            <Routes>{renderRoutes()}</Routes>
          </Layout>
        </Layout>
      </Layout>
    </Root>
  );
};

export default Admin;
