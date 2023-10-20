import React from 'react';
import { Button, Result } from 'antd';

const Done: React.FC = () => {
  const onClick = () => {
    window.location.href = '/';
  };

  return (
    <Result
      status="success"
      title="Your Admin has been created successfully!"
      subTitle="Whenever you are in this browser you will have access to your admin. To create a new configuration, simply click 'exit' in the navigation bar of your new administrative backoffice."
      extra={[
        <Button type="primary" key="console" onClick={onClick}>
          Go Admin
        </Button>
      ]}
    />
  );
};

export default Done;
