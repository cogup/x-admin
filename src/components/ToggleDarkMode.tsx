import React, { useEffect, useState } from 'react';
import { Switch, theme } from 'antd';
import { DataType, useDataSync } from '../utils/sync';

const ToggleDarkMode = (): React.ReactElement => {
  const {
    token: { colorBgBase }
  } = theme.useToken();
  const { data, updateData } = useDataSync();
  const [checked, setChecked] = useState<boolean>(data.darkMode ?? false);

  useEffect(() => {
    updateData(DataType.DARK_MODE, checked);
  }, [checked]);

  return (
    <Switch
      checkedChildren="🌙"
      unCheckedChildren="🌞"
      checked={checked}
      onChange={setChecked}
      style={{
        backgroundColor: colorBgBase
      }}
    />
  );
};

export default ToggleDarkMode;
