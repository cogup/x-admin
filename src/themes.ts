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
  const colorPrimary = data.primaryColor || defaultPrimaryColor;

  const colorL = color(colorPrimary);
  const light = {
    token: {
      colorWhite: colorL.isDark() ? '#fff' : '#555',
      colorBgLayout: 'transparent',
      colorBgContainer: 'rgba(255, 255, 255, 0.9)',
      colorTextBase: '#222',
      colorPrimary: data.primaryColor || colorPrimary,
      colorLink: data.primaryColor || colorPrimary,
      colorInfo: data.primaryColor || colorL.lighten(0.6).hex()
    },
    algorithm: theme.defaultAlgorithm
  };

  const colorD = color(colorPrimary).darken(0.5);

  const dark = {
    token: {
      colorBgLayout: defineColorBgLayoutDark(data),
      colorBgContainer: 'rgba(22, 22, 22, 0.95)',
      colorTextBase: '#fff',
      colorPrimary: data.primaryColor || colorD.hex(),
      colorLink: data.primaryColor || colorD.darken(0.6).hex()
    },
    algorithm: theme.darkAlgorithm
  };

  return {
    dark: fixTheme(dark),
    light: fixTheme(light)
  };
};

export default getThemes;
