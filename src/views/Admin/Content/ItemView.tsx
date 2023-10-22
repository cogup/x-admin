import React, { useEffect, useState } from 'react';
import {
  Card,
  Descriptions,
  Row,
  Col,
  Spin,
  notification,
  Button,
  Popconfirm,
  List
} from 'antd';
import {
  ResourceTypes,
  type Controller,
  type Resource
} from '../../../controller';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { DynamicIcon, Header } from '../../../ui';
import { DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { getIconSuggestion } from '../../../utils';
import { IconType } from '../../../ui/iconTypes';
import { useIsMobile } from '../../../use';
import styled from 'styled-components';

const WrapperButtonsMobile = styled(Row)`
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
`;

interface ItemViewProps {
  resource: Resource;
  controller: Controller;
}

const ItemView: React.FC<ItemViewProps> = ({
  resource,
  controller
}: ItemViewProps): React.ReactElement => {
  const [data, setData] = useState<Record<string, any> | null>(null);
  const { [resource.metadata?.id || 'id']: itemId } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const resourceUpdate = controller.getResourceSafe(
    resource.resourceName,
    ResourceTypes.UPDATE
  );
  const resourceDelete = controller.getResourceSafe(
    resource.resourceName,
    ResourceTypes.DELETE
  );
  const resourceList = controller.getResourceSafe(
    resource.resourceName,
    ResourceTypes.LIST
  );
  const isMobile = useIsMobile();

  useEffect((): void => {
    fetchData().catch((error) => {
      notification.error({
        message: `Error fetching item: ${error}`
      });
    });
  }, []);

  const fetchData = async (): Promise<void> => {
    setLoading(true);
    const data = await resource.call({
      params: { id: itemId }
    });
    if (data.data !== undefined) {
      setData(data.data);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Row
        justify={'center'}
        align={'middle'}
        style={{
          height: '100%'
        }}
      >
        <Col>
          <Spin size="large" />
        </Col>
      </Row>
    );
  }

  const renderLink = (value: any): any => {
    if (typeof value === 'string') {
      if (value.startsWith('http://') || value.startsWith('https://')) {
        return <Link to={value}>{value}</Link>;
      } else if (value.startsWith('api://')) {
        const href = `${controller.server}/${value.replace('api://', '')}`;
        return <Link to={href}>{value}</Link>;
      }
    }

    return value;
  };

  const deleteResource = async (): Promise<void> => {
    if (!resourceDelete) {
      return;
    }

    await resourceDelete.call({
      params: { [resource.metadata?.id || 'id']: itemId }
    });
    notification.success({
      message: `Item deleted successfully`
    });

    if (resourceList) {
      navigate(resourceList.getLocalPath());
    }
  };

  const actionButton = (): React.ReactElement | null => {
    return (
      <>
        {resourceUpdate && (
          <Button
            type="primary"
            onClick={() =>
              navigate(
                resourceUpdate.getLocalPath({
                  params: { id: itemId }
                })
              )
            }
            style={{ marginRight: '0.5rem' }}
          >
            Edit{' '}
            {controller
              .resolveResourceName(resourceUpdate.resourceName)
              .toLowerCase()}
          </Button>
        )}
        {resourceDelete && (
          <Popconfirm
            placement="left"
            title="Delete the task"
            description="Are you sure you want to delete the selected items?"
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            onConfirm={() => {
              deleteResource().catch((error) => {
                notification.error({
                  message: `Error deleting items: ${error}`
                });
              });
            }}
          >
            <Button
              type="primary"
              danger={true}
              icon={<DeleteOutlined style={{ fontSize: '1.0rem' }} />}
            >
              Delete selected
            </Button>
          </Popconfirm>
        )}
      </>
    );
  };

  return (
    <Row>
      <Header
        title={resource.summary ?? resource.resourceName}
        subtitle={resource.apiPath}
        button={isMobile ? null : actionButton()}
        description={resource.description}
        resourceName={resource.resourceName}
        typeName={resource.type}
      />

      <Card
        title="Visualização do Item"
        style={{
          width: '100%'
        }}
      >
        <List
          itemLayout="horizontal"
          dataSource={data ? Object.entries(data) : []}
          renderItem={([key, value], index) => {
            const label = (
              <>
                <DynamicIcon iconName={getIconSuggestion(key) as IconType} />
                {' ' + key.charAt(0).toUpperCase() + key.slice(1)}
              </>
            );

            return (
              <List.Item key={index}>
                <List.Item.Meta title={label} description={renderLink(value)} />
              </List.Item>
            );
          }}
        />
      </Card>

      {isMobile && (
        <WrapperButtonsMobile>{actionButton()}</WrapperButtonsMobile>
      )}
    </Row>
  );
};

export default ItemView;
