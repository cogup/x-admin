import React from 'react';
import { Breadcrumb as BreadcrumbUI } from 'antd';
import { Controller, ResourceTypes } from '../controller';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { rp } from '../utils';

const Empty = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 22px;
`;

interface BreadcrumbProps {
  breadcrumb: string[];
  controller: Controller;
}

const Breadcrumb = ({
  breadcrumb,
  controller
}: BreadcrumbProps): React.ReactElement => {
  const navigate = useNavigate();

  if (breadcrumb == null || breadcrumb.length === 0) {
    return <Empty />;
  }

  const resourceList = controller.getResourceSafe(
    breadcrumb[0].toLowerCase(),
    ResourceTypes.LIST
  );

  if (resourceList === null) {
    return <Empty />;
  }

  const others = breadcrumb.slice(1);

  interface Items {
    key: string;
    title: string;
    onClick?: any;
    path: string;
  }

  const gotToBreadcrumb = (path: string): any => {
    return (e: any): void => {
      e.preventDefault();
      navigate(rp(`/admin${path}`));
    };
  };

  const items: Items[] = [
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
      path: ''
    });
  });

  return (
    <BreadcrumbUI
      style={{ margin: '16px 0', cursor: 'pointer' }}
      items={items}
    />
  );
};

export default Breadcrumb;
