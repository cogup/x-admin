import { theme } from 'antd';
import { DataSyncContextData, Theme } from './utils/sync';
import color from 'color';

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
    colorLink: string;
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

const defaultPrimaryColor = '#8F00D3';

const getThemes = (data: DataSyncContextData): Themes => {
  const light = {
    token: {
      colorBgLayout: 'transparent',
      colorBgContainer: 'rgba(255, 255, 255, 0.9)',
      colorTextBase: '#222',
      colorPrimary: data.primaryColor || defaultPrimaryColor,
      colorLink: data.primaryColor || defaultPrimaryColor,
      colorInfo:
        data.primaryColor || color(defaultPrimaryColor).lighten(0.6).hex()
    },
    algorithm: theme.defaultAlgorithm
  };

  const dark = {
    token: {
      colorBgLayout: defineColorBgLayoutDark(data),
      colorBgContainer: 'rgba(22, 22, 22, 0.95)',
      colorTextBase: '#fff',
      colorPrimary: data.primaryColor || defaultPrimaryColor,
      colorLink:
        data.primaryColor || color(defaultPrimaryColor).lighten(0.6).hex()
    },
    algorithm: theme.darkAlgorithm
  };

  return {
    dark: fixTheme(dark),
    light: fixTheme(light)
  };
};

export default getThemes;
