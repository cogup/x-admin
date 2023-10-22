import React from 'react';
import { LogoutOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';
import { DataType, useDataSync } from '../utils/sync';
import { useNavigate } from 'react-router-dom';

const ExitButton = () => {
  const { removeData } = useDataSync();
  const navigate = useNavigate();

  return (
    <Popconfirm
      placement="bottomRight"
      title={'Exit'}
      description={'Are you sure you want to exit?'}
      onConfirm={() => {
        removeData(DataType.SPECIFICATION);
        navigate('/setup');
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
