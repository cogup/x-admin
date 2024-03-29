import styled from 'styled-components';
import { GlobalToken } from 'antd';
import color from 'color';
import { Theme } from '../themes';

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
    console.log({
      $darkMode,
      $token,
      $theme,
      $backgroundImage
    });
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

    if ($darkMode || $theme === Theme.DARK) {
      if ($backgroundImage) {
        return `
        background: linear-gradient(135deg, rgba(0,0,0, 1) 0%, rgba(${colorPrimary}, 0.2) 100%);
      `;
      }
      return '';
    }

    if ($backgroundImage) {
      return `
        background: linear-gradient(135deg, rgba(${colorBgBase}, 1) 0%, rgba(${colorPrimary}, 0.2) 100%);
      `;
    }
  }}
`;

export default Glass;
