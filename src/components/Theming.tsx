import React, { useEffect, useState } from 'react';
import { ConfigProvider } from 'antd';
import getThemes, { CustomTheme } from '../themes';
import { Theme, useDataSync } from '../utils/sync';

interface ContentProps {
  children: React.ReactNode;
  internal?: boolean;
}

const Theming = ({ children, internal }: ContentProps): React.ReactElement => {
  const { data } = useDataSync();
  const themes = getThemes(data);

  const definePrincipalTheme = (): Theme => {
    if (data.theme === Theme.LIGHTING) {
      return internal ? Theme.DARK : Theme.LIGHT;
    }

    if (data.theme === Theme.DARKER) {
      return internal ? Theme.LIGHT : Theme.DARK;
    }

    return data.theme === undefined ? Theme.DARK : data.theme;
  };

  const principalTheme = definePrincipalTheme();

  const returnTheme = (): CustomTheme => {
    if (data.darkMode) {
      return themes.dark;
    }

    if (principalTheme === Theme.DARK) {
      return themes.dark;
    }

    return themes.light;
  };

  const [customTheme, setCustomTheme] = useState(returnTheme());

  useEffect(() => {
    setCustomTheme(returnTheme());
  }, [data]);

  return <ConfigProvider theme={customTheme}>{children}</ConfigProvider>;
};

export default Theming;
