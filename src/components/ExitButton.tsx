import React from 'react';
import { LogoutOutlined } from '@ant-design/icons';
import { Button, Popconfirm, theme } from 'antd';
import { useDataSync } from '../utils/sync';

const ExitButton = () => {
  const { data, updateData } = useDataSync();

  return (
    <Popconfirm
      placement="bottomRight"
      title={'Exit'}
      description={'Are you sure you want to exit?'}
      onConfirm={() => {
        updateData({
          darkMode: data.darkMode
        });
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
