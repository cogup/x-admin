import React, { useEffect, useState } from 'react';
import { Menu, Layout } from 'antd';
import { useNavigate } from 'react-router-dom';
import { capitalizeFirstLetter, getIconSuggestion } from '../utils';
import type { MenuProps } from 'antd';
import { ResourceTypes, type Controller, Resource } from '../controller';
import { DynamicIcon } from '../ui';
import { type IconType } from '../ui/iconTypes';
import styled from 'styled-components';
import { useIsMobile } from '../use';

const MenuMobileWrapper = styled.div`
  float: left;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  overflow-y: auto;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
`;

type MenuItem = Required<MenuProps>['items'][number];

interface SidebarProps {
  controller: Controller;
  aditionalItems?: MenuItem[];
}

const { Sider } = Layout;

const Sidebar: React.FC<SidebarProps> = ({
  controller,
  aditionalItems = []
}): React.ReactElement => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  let resource = controller.getCurrentResource(location.pathname);

  const [currentResource, setCurrentResource] = useState<Resource | null>(
    resource
  );

  useEffect(() => {
    const resource = controller.getCurrentResource(location.pathname);

    setCurrentResource(resource);
  }, [location]);

  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
    onClick?: () => void
  ): MenuItem {
    return {
      label,
      key,
      icon,
      children,
      type,
      onClick
    };
  }

  const getItems = (): MenuItem[] => {
    const menu: MenuItem[] = aditionalItems;

    controller.getAllGroupsName().forEach((groupName) => {
      const items = controller.getAllResourcesByGroup(groupName);

      menu.push(
        getItem(
          capitalizeFirstLetter(groupName),
          groupName,
          <DynamicIcon iconName={getIconSuggestion(groupName) as IconType} />,
          items.map((resource): MenuItem => {
            if (
              ![ResourceTypes.CREATE, ResourceTypes.LIST].includes(
                resource.type
              )
            ) {
              return null;
            }

            const localPath = resource.getLocalPath();

            return getItem(
              capitalizeFirstLetter(
                resource.summary ?? `${resource.resource} ${resource.type}`
              ),
              localPath,
              <DynamicIcon
                iconName={
                  getIconSuggestion(
                    resource.resource,
                    resource.type
                  ) as IconType
                }
              />,
              undefined,
              undefined,
              (): void => {
                navigate(localPath);
              }
            );
          })
        )
      );
    });

    return menu;
  };

  const renderMenu = (style: any) => (
    <Menu
      selectedKeys={[location.pathname]}
      defaultOpenKeys={[currentResource?.group ?? '']}
      mode="inline"
      theme="dark"
      style={style}
      items={getItems()}
    />
  );

  if (isMobile) {
    return (
      <MenuMobileWrapper>
        {renderMenu({
          height: '100%',
          width: 'auto'
        })}
      </MenuMobileWrapper>
    );
  }

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value): void => {
        setCollapsed(value);
      }}
    >
      {renderMenu({
        height: '100%',
        width: 'auto'
      })}
    </Sider>
  );
};

export default Sidebar;
