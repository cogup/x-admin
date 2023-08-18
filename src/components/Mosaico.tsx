import React, { useEffect } from 'react';
import { Row, Col, Card, Layout } from 'antd';
import { DynamicIcon, Header } from '../ui';
import { getIconSuggestion, capitalizeFirstLetter } from '../utils';
import { ResourceTypes, type Controller, type Resource } from '../controller';
import { useNavigate } from 'react-router-dom';
import { type IconType } from '../ui/iconTypes';
import { useIsMobile } from '../use';

interface MosaicoProps {
  groupName: string;
  controller: Controller;
}

const Mosaico: React.FC<MosaicoProps> = ({
  groupName,
  controller
}): React.ReactElement => {
  const navigate = useNavigate();
  const resources = controller.getAllResourcesByGroup(groupName);

  const handleClick = (resource: Resource): void => {
    const localPath = resource.getLocalPath();
    navigate(localPath);
  };

  return (
    <Card style={{ marginBottom: '16px' }} bodyStyle={{ padding: '24px' }}>
      <Card.Meta
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <DynamicIcon
              iconName={getIconSuggestion(groupName) as IconType}
              style={{ marginRight: '8px' }}
            />
            {capitalizeFirstLetter(groupName)}
          </div>
        }
      />
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        {resources.map((resource) => {
          if (
            ![ResourceTypes.CREATE, ResourceTypes.LIST].includes(resource.type)
          ) {
            return null;
          }

          const iconName = getIconSuggestion(
            resource.resourceName,
            resource.type
          ) as IconType;

          return (
            <Col key={resource.resourceName} span={12}>
              <Card
                onClick={() => {
                  handleClick(resource);
                }}
                hoverable
                style={{ cursor: 'pointer' }}
                bodyStyle={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column'
                }}
              >
                <DynamicIcon
                  iconName={iconName}
                  style={{ fontSize: '2em', marginBottom: '0.2em' }}
                />
                <div>{capitalizeFirstLetter(resource.resourceName)}</div>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Card>
  );
};

interface MosaicosProps {
  controller: Controller;
}

const Mosaicos: React.FC<MosaicosProps> = ({
  controller
}): React.ReactElement => {
  const groups = controller.getAllGroupsName();
  const isMobile = useIsMobile();
  const [boxSize, setBoxSize] = React.useState(6);

  useEffect(() => {
    if (isMobile) {
      setBoxSize(24);
    } else {
      setBoxSize(6);
    }
  }, [isMobile]);

  return (
    <Layout>
      <Row>
        <Header
          title={controller.apiAdmin.info.title}
          subtitle={controller.host}
          description={controller.apiAdmin.info.description}
        />
      </Row>
      <Row gutter={[16, 16]}>
        {groups.map((groupName) => (
          <Col key={groupName} span={boxSize}>
            <Mosaico groupName={groupName} controller={controller} />
          </Col>
        ))}
      </Row>
    </Layout>
  );
};

export default Mosaicos;
