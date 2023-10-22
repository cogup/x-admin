import React from 'react';
import { Row, Typography, Col, theme } from 'antd';
import DynamicIcon from './DynamicIcon';
import { getIconSuggestion } from '../utils';
import { type IconType } from './iconTypes';
import styled from 'styled-components';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

const HeaderStyled = styled(Row)`
  margin-bottom: 2.5rem;
  width: 100%;

  .title {
    display: flex;
    align-items: center;
    justify-content: center;

    .quest-icon {
      margin-left: 0.2rem;
      margin-bottom: 0.5rem;
      svg {
        font-size: 0.7rem;
      }
    }

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

  const { token } = theme.useToken();

  const renderSubtitle = (): React.ReactNode => {
    if (subtitle !== undefined) {
      return (
        <Typography.Text
          style={{
            margin: 0,
            color: token.colorTextSecondary
          }}
          code
        >
          {subtitle}
        </Typography.Text>
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

  const icon =
    resourceName !== undefined && typeName !== undefined
      ? (getIconSuggestion(resourceName, typeName) as IconType)
      : undefined;

  return (
    <HeaderStyled>
      <Col flex={1}>
        <Row
          justify="space-between"
          style={{
            marginBottom: '1rem',
            margin: -24,
            padding: '12px 24px',
            borderRadius: token.borderRadiusLG,
            backgroundColor: token.colorBgElevated
          }}
        >
          <Col>
            <Row>
              <Col>
                <Row>
                  <Col className="title">
                    {icon !== undefined ? (
                      <DynamicIcon
                        iconName={icon}
                        style={{
                          color: token.colorText
                        }}
                      />
                    ) : null}
                    <Typography.Title level={4} style={{ marginBottom: 0 }}>
                      {title}
                    </Typography.Title>
                    <Tooltip placement="top" title={description}>
                      <QuestionCircleOutlined
                        className="quest-icon"
                        style={{
                          cursor: 'pointer',
                          color: token.colorLink
                        }}
                      />
                    </Tooltip>
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
      </Col>
    </HeaderStyled>
  );
};

export default Header;
