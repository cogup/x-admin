import React, { useEffect, useState } from 'react';
import { Switch, theme } from 'antd';
import { useDataSync } from '../utils/sync';

const ToggleDarkMode = (): React.ReactElement => {
  const {
    token: { colorBgBase }
  } = theme.useToken();
  const { data, updateData } = useDataSync();
  const [checked, setChecked] = useState<boolean>(data.darkMode);

  useEffect(() => {
    updateData({
      ...data,
      darkMode: checked
    });
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
