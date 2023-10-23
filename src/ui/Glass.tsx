import styled from 'styled-components';
import { Theme } from '../utils/sync';
import { GlobalToken } from 'antd';
import color from 'color';

interface GlassProps {
  $darkMode: boolean;
  $token: GlobalToken;
  $theme: Theme;
  $backgroundImage: boolean;
}

const Glass = styled.div<GlassProps>`
  backdrop-filter: blur(5px);
  width: 100%;
  height: 100%;

  ${({ $darkMode, $token, $theme, $backgroundImage }) => {
    if ($darkMode || $theme === Theme.DARK) {
      if ($backgroundImage) {
        return `
        background: linear-gradient(135deg, rgba(0,0,0, 1) 0%, rgba(0,0,0, 0.2) 100%);
      `;
      }
      return '';
    }

    if ($theme === Theme.LIGHT) {
      if ($backgroundImage) {
        return `
        background: linear-gradient(135deg, rgba(255,255,255, 1) 0%, rgba(255,255,255, 0.2) 100%);
      `;
      }
      return '';
    }
    const colorPrimary = color($token.colorPrimary)
      .rgb()
      .string()
      .replace('rgb(', '')
      .replace(')', '');
    const colorBgBase = color($token.colorBgBase)
      .rgb()
      .string()
      .replace('rgb(', '')
      .replace(')', '');

    if ($theme === Theme.DARKER || $theme === Theme.LIGHTING) {
      if ($backgroundImage) {
        return `
        background: linear-gradient(135deg, rgba(${colorBgBase}, 1) 0%, rgba(${colorPrimary}, 0.2) 100%);
      `;
      }
      return `
        background: linear-gradient(135deg, rgba(${colorBgBase}, 1) 0%, rgba(${colorPrimary}, 1.0) 100%);
      `;
    }
  }}
`;

export default Glass;
