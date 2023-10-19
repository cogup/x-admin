import React from 'react';
import { Layout, ConfigProvider } from 'antd';
import styled from 'styled-components';
import locale from 'antd/locale/pt_BR';
import { Typography } from 'antd';
import StepsMaker from '../components/Steps';
import AddUrl from './AddUrl';
import AdjustTemplates from './AdjustTemplates';

const { Paragraph, Title } = Typography;
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

const customTheme = {
  token: {
    borderRadiusLG: 10
  }
};

const App = (): React.ReactElement => {
  const onChangeStep = (data: any) => {
    console.log(data);
  };

  return (
    <ConfigProvider theme={customTheme} locale={locale}>
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
            <StepsMaker
              onDone={onChangeStep}
              onNext={onChangeStep}
              steps={[
                {
                  key: 'addUrl',
                  title: 'Add OpenAPI Specification',
                  content: AddUrl
                },
                {
                  key: 'adjustTemplates',
                  title: 'Adjust templates',
                  content: AdjustTemplates
                }
              ]}
            />
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
    </ConfigProvider>
  );
};

export default App;
