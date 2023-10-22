import React from 'react';
import { Layout, theme } from 'antd';
import Theming from '../../../components/Theming';

interface ContentProps {
  background?: boolean;
  children: React.ReactNode;
}

const Content = ({ children }: ContentProps): React.ReactElement => {
  const { token } = theme.useToken();

  return (
    <Layout.Content
      style={{
        padding: 24,
        minHeight: 'auto',
        marginBottom: 24,
        borderRadius: token.borderRadiusLG,
        backgroundColor: token.colorBgContainer
      }}
    >
      {children}
    </Layout.Content>
  );
};

export default Content;
