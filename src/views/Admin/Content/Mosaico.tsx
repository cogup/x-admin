import React, { useEffect } from 'react';
import { Row, Col, Card, theme } from 'antd';
import { DynamicIcon } from '../../../ui';
import { getIconSuggestion, capitalizeFirstLetter, rp } from '../../../utils';
import {
  ResourceTypes,
  type Controller,
  type Resource
} from '../../../controller';
import { useNavigate } from 'react-router-dom';
import { type IconType } from '../../../ui/iconTypes';
import { useIsMobile, useIsDesktop } from '../../../use';

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
  const { token } = theme.useToken();

  const handleClick = (resource: Resource): void => {
    const localPath = rp(`/admin${resource.getLocalPath()}`);
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
        {resources.map((resource, index) => {
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
            <Col key={index} span={12}>
              <Card
                onClick={() => {
                  handleClick(resource);
                }}
                hoverable
                style={{
                  cursor: 'pointer',
                  backgroundColor: token.colorPrimary
                }}
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
  const isDesktop = useIsDesktop();
  const [boxSize, setBoxSize] = React.useState(6);

  useEffect(() => {
    if (isMobile) {
      setBoxSize(24);
    } else if (isDesktop) {
      setBoxSize(12);
    } else {
      setBoxSize(6);
    }
  }, [isMobile, isDesktop]);

  return (
    <Row gutter={[16, 16]}>
      {groups.map((groupName, index) => (
        <Col key={index} span={boxSize}>
          <Mosaico groupName={groupName} controller={controller} />
        </Col>
      ))}
    </Row>
  );
};

export default Mosaicos;
