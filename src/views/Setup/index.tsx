import React from 'react';
import { Layout } from 'antd';
import styled from 'styled-components';
import StepsMaker from '../../components/Steps';
import ImportSpec from './ImportSpec';
import GlobalHeader from '../../components/GlobalHeader';
import SettingTheme from './SettingTheme';
import { OpenAPI } from '../../controller/openapi';
import Adjust from './Adjust';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';
import { rp } from '../../utils';

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

interface SettingThemeData {
  backgroundImage?: string;
  primaryColor?: string;
  activeGradient?: boolean;
}

interface SetupData {
  specification?: OpenAPI;
  adjust?: OpenAPI;
  theme?: SettingThemeData;
}

const Setup = (): React.ReactElement => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const onDone = (_: SetupData) => {
    navigate(rp('/admin'));
  };

  return (
    <Root>
      <Layout
        style={{
          width: '100vw',
          minHeight: '100vh'
        }}
      >
        <GlobalHeader title="Admin" contentRef={contentRef} />
        <div
          ref={contentRef}
          style={{
            overflow: 'auto',
            height: '100vh',
            paddingTop: 45
          }}
        >
          <Layout.Content
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '2rem'
            }}
          >
            <StepsMaker
              theming={true}
              confirmToNext={true}
              onDone={onDone}
              steps={[
                {
                  key: 'specification',
                  title: 'Import OpenAPI',
                  content: ImportSpec
                },
                {
                  key: 'adjust',
                  title: 'Adjust settings',
                  content: Adjust
                },
                {
                  key: 'theme',
                  title: 'Custom theme',
                  content: SettingTheme
                }
              ]}
            />
          </Layout.Content>
          <Footer />
        </div>
      </Layout>
    </Root>
  );
};

export default Setup;
