import React from 'react';
import { Layout } from 'antd';
import styled from 'styled-components';
import { Typography, theme } from 'antd';
import StepsMaker from '../components/Steps';
import AdjustTemplates from './AdjustTemplates';
import ImportSpec from './ImportSpec';
import Done from './Done';

const { Title } = Typography;
const { Header, Content, Footer } = Layout;

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

const Setup = (): React.ReactElement => {
  const [done, setDone] = React.useState<boolean>(false);

  const onDone = (data: any) => {
    setDone(true);
    localStorage.setItem('specification', JSON.stringify(data.xAdmin));
  };

  return (
    <Root>
      <Layout
        style={{
          width: '100vw',
          minHeight: '100vh'
        }}
      >
        <Header
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Title
            style={{
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              textAlign: 'center'
            }}
          >
            X Admin
          </Title>
        </Header>
        <Content
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '2rem'
          }}
        >
          {done ? (
            <Done />
          ) : (
            <StepsMaker
              confirmToNext={true}
              onDone={onDone}
              steps={[
                {
                  key: 'specification',
                  title: 'Import OpenAPI Specification',
                  content: ImportSpec
                },
                {
                  key: 'xAdmin',
                  title: 'Adjust templates',
                  content: AdjustTemplates
                }
              ]}
            />
          )}
        </Content>
        <Footer
          style={{
            textAlign: 'center'
          }}
        >
          X-Admin ©2023 Created by{' '}
          <a href="http://cogup.ai" target="_blank" rel="noreferrer">
            Cogup
          </a>{' '}
          and{' '}
          <a
            href="http://github/cogup/x-admin"
            target="_blank"
            rel="noreferrer"
          >
            community contributors
          </a>
          .
        </Footer>
      </Layout>
    </Root>
  );
};

export default Setup;
