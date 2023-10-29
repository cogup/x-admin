import React from 'react';
import { LogoutOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';
import { DataType, GlobalVars, useDataSync } from '../utils/sync';
import { useNavigate } from 'react-router-dom';
import { rp } from '../utils';

const ExitButton = () => {
  const { removeData } = useDataSync();
  const navigate = useNavigate();

  return (window as GlobalVars).specification === undefined ? (
    <Popconfirm
      placement="bottomRight"
      title={'Exit'}
      description={'Are you sure you want to exit?'}
      onConfirm={() => {
        removeData(DataType.SPECIFICATION);
        navigate(rp('/setup'));
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
  ) : null;
};

export default ExitButton;
