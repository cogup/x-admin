import React, { useEffect, useState } from 'react';
import { ConfigProvider } from 'antd';
import getThemes, { CustomTheme, Theme, defaultTheme } from '../themes';
import { DataSyncContextData, useDataSync } from '../utils/sync';

interface ContentProps {
  children: React.ReactNode;
  internal?: boolean;
}

export const resolveTheme = (
  data: DataSyncContextData,
  internal?: boolean
): CustomTheme => {
  const themes = getThemes(data);

  if (data.darkMode === true || data.theme === Theme.DARK) {
    return themes.dark;
  }

  if (data.theme === Theme.LIGHTING) {
    return internal ? themes.dark : themes.light;
  }

  if (data.theme === Theme.DARKER) {
    return internal ? themes.light : themes.dark;
  }

  return themes.light;
};

const Theming = ({ children, internal }: ContentProps): React.ReactElement => {
  const { data } = useDataSync();

  const [customTheme, setCustomTheme] = useState(resolveTheme(data, internal));

  useEffect(() => {
    setCustomTheme(resolveTheme(data, internal));
  }, [data]);

  return <ConfigProvider theme={customTheme}>{children}</ConfigProvider>;
};

export default Theming;
