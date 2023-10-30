import React from 'react';
import { Layout, theme } from 'antd';
import Container from '../../../ui/Container';

interface ContentProps {
  background?: boolean;
  children: React.ReactNode;
}

const Content = ({ children }: ContentProps): React.ReactElement => {
  return (
    <Container
      style={{
        padding: 24,
        minHeight: 'auto',
        marginBottom: 24
      }}
    >
      {children}
    </Container>
  );
};

export default Content;
