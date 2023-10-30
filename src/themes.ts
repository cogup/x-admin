import { theme } from 'antd';
import { DataSyncContextData } from './utils/sync';
import color from 'color';

// add themes, light, darker, lighting and dark
export enum Theme {
  LIGHT = 'light',
  LIGHTING = 'lighting',
  DARKER = 'darker',
  DARK = 'dark'
}

const defineColorBgLayout = (data: DataSyncContextData, color: string) => {
  if (data.backgroundImage) {
    return 'transparent';
  }

  return color;
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

export const defaultPrimaryColor = '#1890ff';
export const defaultTheme = Theme.LIGHT;

export interface CustomColors {
  light: {
    colorTextBase: string;
    colorBgContainer: string;
  };
  dark: {
    colorTextBase: string;
    colorBgContainer: string;
  };
}

export const customColors: CustomColors = {
  light: {
    colorTextBase: '#161616',
    colorBgContainer: 'rgba(255, 255, 255, 0.9)'
  },
  dark: {
    colorTextBase: '#fff',
    colorBgContainer: '#161616'
  }
};

const getThemes = (data: DataSyncContextData): Themes => {
  const colorPrimary = data.primaryColor || defaultPrimaryColor;

  const colorL = color(colorPrimary);
  const light = {
    token: {
      colorWhite: colorL.isDark() ? '#fff' : '#555',
      colorBgLayout: defineColorBgLayout(data, '#fafafa'),
      colorBgContainer: customColors.light.colorBgContainer,
      colorTextBase: customColors.light.colorTextBase,
      colorPrimary: data.primaryColor || colorPrimary,
      colorLink: data.primaryColor || colorPrimary,
      colorInfo: data.primaryColor || colorL.lighten(0.6).hex()
    },
    algorithm: theme.defaultAlgorithm
  };

  const colorD = color(colorPrimary).darken(0.1);

  const dark = {
    token: {
      colorWhite: colorL.isDark() ? '#fff' : '#555',
      colorBgLayout: defineColorBgLayout(data, '#161616'),
      colorBgContainer: customColors.dark.colorBgContainer,
      colorTextBase: customColors.dark.colorTextBase,
      colorPrimary: data.primaryColor || colorD.hex(),
      colorLink: data.primaryColor || colorD.lighten(0.1).hex()
    },
    algorithm: theme.darkAlgorithm
  };

  return {
    dark: fixTheme(dark),
    light: fixTheme(light)
  };
};

export default getThemes;
