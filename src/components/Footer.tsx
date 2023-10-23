import { Layout } from 'antd';
import React from 'react';

const Footer = (): React.ReactElement => {
  return (
    <Layout.Footer
      style={{
        textAlign: 'center'
      }}
    >
      X-Admin ©2023 Created by{' '}
      <a href="http://cogup.ai" target="_blank" rel="noreferrer">
        Cogup
      </a>{' '}
      and{' '}
      <a href="http://github/cogup/x-admin" target="_blank" rel="noreferrer">
        community contributors
      </a>
      .
    </Layout.Footer>
  );
};

export default Footer;
