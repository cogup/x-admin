import React from 'react';
import { Layout, theme } from 'antd';

const { Content: ContentLayout } = Layout;

interface ContentProps {
  background?: boolean;
  children: React.ReactNode;
}

const Content = ({ children }: ContentProps): React.ReactElement => {
  const { token } = theme.useToken();

  return (
    <ContentLayout
      style={{
        padding: 24,
        minHeight: 'auto',
        marginBottom: 24,
        backgroundColor: token.colorBgContainer,
        borderRadius: token.borderRadiusLG
      }}
    >
      {children}
    </ContentLayout>
  );
};

export default Content;
