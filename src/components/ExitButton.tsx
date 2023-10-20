import { LogoutOutlined } from '@ant-design/icons';
import { Button, Popconfirm, theme } from 'antd';
import React from 'react';
import { useDataSync } from '../utils/sync';

const ExitButton = () => {
  const { data, updateData } = useDataSync();
  const {
    token: { colorTextBase }
  } = theme.useToken();

  return (
    <Popconfirm
      placement="bottomRight"
      title={'Exit'}
      description={'Are you sure you want to exit?'}
      onConfirm={() => {
        updateData({
          ...data,
          specification: undefined
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
          boxShadow: 'none',
          color: colorTextBase
        }}
      />
    </Popconfirm>
  );
};

export default ExitButton;
