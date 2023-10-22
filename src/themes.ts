import { theme } from 'antd';
import { DataSyncContextData, Theme } from './utils/sync';

const defineColorBgLayoutDark = (data: DataSyncContextData) => {
  if (data.backgroundImage) {
    return 'transparent';
  }

  return '#0f0f0f';
};

interface CustomThemeNoFix {
  token: {
    colorBgLayout: string;
    colorBgContainer: string;
    colorTextBase: string;
    colorPrimary: string;
  };
  algorithm: any;
}

export interface CustomTheme extends CustomThemeNoFix {
  components: {
    Layout: {
      siderBg: string;
      headerBg: string;
    };
    Menu: {
      subMenuItemBg: string;
      itemBg: string;
    };
  };
}

export interface Themes {
  light: CustomTheme;
  dark: CustomTheme;
}

const fixTheme = (theme: CustomThemeNoFix): CustomTheme => {
  return {
    ...theme,
    components: {
      Layout: {
        siderBg: 'transparent',
        headerBg: 'transparent'
      },
      Menu: {
        subMenuItemBg: 'transparent',
        itemBg: 'transparent'
      }
    }
  };
};

const getThemes = (data: DataSyncContextData): Themes => {
  const { token } = theme.useToken();
  const light = {
    token: {
      colorBgLayout: 'transparent',
      colorBgContainer: 'rgba(255, 255, 255, 0.9)',
      colorTextBase: '#222',
      colorPrimary: data.primaryColor || token.colorPrimary
    },
    algorithm: theme.defaultAlgorithm
  };

  const dark = {
    token: {
      colorBgLayout: defineColorBgLayoutDark(data),
      colorBgContainer: 'rgba(22, 22, 22, 0.95)',
      colorTextBase: token.colorTextBase,
      colorPrimary: data.primaryColor || token.colorPrimary
    },
    algorithm: theme.darkAlgorithm
  };

  return {
    dark: fixTheme(dark),
    light: fixTheme(light)
  };
};

export default getThemes;
