import styled from 'styled-components';
import { Theme } from '../utils/sync';

interface GlassProps {
  $darkMode: boolean;
  $backgroundGradient?: boolean;
  $backgroundUrl?: boolean;
  $theme?: Theme;
}

const Glass = styled.div<GlassProps>`
  backdrop-filter: blur(5px);
  width: 100%;
  height: 100%;

  ${({ $darkMode, $backgroundGradient, $backgroundUrl, $theme }) => {
    if (
      $backgroundGradient ||
      ($backgroundUrl && $darkMode) ||
      $theme === Theme.DARKER ||
      $theme === Theme.DARK
    ) {
      const color =
        $darkMode || $theme === Theme.DARKER || $theme === Theme.DARK
          ? '0, 0, 0'
          : '255, 255, 255';

      return `
        background: linear-gradient(135deg, rgba(${color}, 1) 0%, rgba(${color}, 0.2) 100%);
      `;
    }
  }}
`;

export default Glass;
