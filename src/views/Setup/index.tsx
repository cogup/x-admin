import React from 'react';
import { Layout } from 'antd';
import styled from 'styled-components';
import StepsMaker from '../../components/Steps';
import AdjustTemplates from './AdjustTemplates';
import ImportSpec from './ImportSpec';
import GlobalHeader from '../../components/GlobalHeader';
import { useDataSync } from '../../utils/sync';
import SettingTheme from './SettingTheme';
import { OpenAPI } from '../../controller/openapi';
import { AdminData } from '../../controller/xadmin';

const { Content, Footer } = Layout;

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
  const { data, updateData } = useDataSync();
  const [done, setDone] = React.useState<boolean>(false);
  const contentRef = React.useRef<HTMLDivElement>(null);

  const onDone = (newData: SetupData) => {
    setDone(true);

    updateData({
      ...data,
      backgroundImage: newData.theme?.backgroundImage,
      backgroundGradient: newData.theme?.activeGradient,
      primaryColor: newData.theme?.primaryColor,
      specification: newData.adjust,
      backgroundColor: false
    });
  };

  return (
    <Root>
      <Layout
        style={{
          width: '100vw',
          minHeight: '100vh'
        }}
      >
        <GlobalHeader title="X Admin" contentRef={contentRef} />
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
                  title: 'Adjust templates',
                  content: AdjustTemplates
                },
                {
                  key: 'theme',
                  title: 'Custom theme',
                  content: SettingTheme
                }
              ]}
            />
          </Layout.Content>
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
        </div>
      </Layout>
    </Root>
  );
};

export default Setup;
