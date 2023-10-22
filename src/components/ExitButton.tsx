import React from 'react';
import { LogoutOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';
import { DataType, useDataSync } from '../utils/sync';

const ExitButton = () => {
  const { removeData } = useDataSync();

  return (
    <Popconfirm
      placement="bottomRight"
      title={'Exit'}
      description={'Are you sure you want to exit?'}
      onConfirm={() => {
        removeData(DataType.SPECIFICATION);
      }}
      okText="Yes"
      cancelText="No"
    >
      <Button
        icon={<LogoutOutlined />}
        style={{
          background: 'transparent',
          border: 'none',
          boxShadow: 'none'
        }}
      />
    </Popconfirm>
  );
};

export default ExitButton;
