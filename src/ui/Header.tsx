import React from 'react';
import { Row, Typography, Col } from 'antd';
import DynamicIcon from './DynamicIcon';
import { getIconSuggestion } from '../utils';
import { type IconType } from './iconTypes';
import styled from 'styled-components';

const HeaderStyled = styled(Row)`
  margin-bottom: 1rem;
  width: 100%;

  .title {
    display: flex;
    align-items: center;
    justify-content: center;

    span {
      margin-right: 0.5em;
      svg {
        font-size: 1.5rem;
      }
    }
  }
`;
interface HeaderProps {
  title?: string;
  subtitle?: string;
  button?: React.ReactNode;
  description?: string;
  resourceName?: string;
  typeName?: string;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  button,
  description,
  resourceName,
  typeName
}): React.ReactElement => {
  if (title === undefined && subtitle !== undefined) {
    title = subtitle;
    subtitle = undefined;
  } else if (title === undefined) {
    throw new Error('Title is required');
  }

  const renderSubtitle = (): React.ReactNode => {
    if (subtitle !== undefined) {
      return (
        <Typography.Title level={5} style={{ margin: 0 }}>
          {subtitle}
        </Typography.Title>
      );
    }

    return null;
  };

  const renderButton = (): React.ReactNode => {
    if (button !== undefined) {
      return <Col>{button}</Col>;
    }

    return null;
  };

  const renderDescription = (): React.ReactNode => {
    if (description !== undefined) {
      return <Typography.Paragraph>{description}</Typography.Paragraph>;
    }

    return null;
  };

  const icon =
    resourceName !== undefined && typeName !== undefined
      ? (getIconSuggestion(resourceName, typeName) as IconType)
      : undefined;

  return (
    <HeaderStyled>
      <Col flex={1}>
        <Row justify="space-between" style={{ marginBottom: '1rem' }}>
          <Col>
            <Row>
              <Col>
                <Row>
                  <Col className="title">
                    {icon !== undefined ? (
                      <DynamicIcon iconName={icon} />
                    ) : null}
                    <Typography.Title level={2} style={{ marginBottom: 0 }}>
                      {title}
                    </Typography.Title>
                  </Col>
                </Row>
                <Row>
                  <Col>{renderSubtitle()}</Col>
                </Row>
              </Col>
            </Row>
          </Col>
          {renderButton()}
        </Row>
        {renderDescription()}
      </Col>
    </HeaderStyled>
  );
};

export default Header;
