import styled from 'styled-components';

interface GlassProps {
  darkMode?: boolean;
  backgroundGradient?: boolean;
  backgroundUrl?: boolean;
}

const Glass = styled.div<GlassProps>`
  backdrop-filter: blur(5px);
  width: 100%;
  height: 100%;

  ${({ darkMode, backgroundGradient, backgroundUrl }) => {
    if (backgroundGradient || (backgroundUrl && darkMode)) {
      const color = darkMode ? '0, 0, 0' : '255, 255, 255';

      return `
        background: linear-gradient(135deg, rgba(${color}, 1) 0%, rgba(${color}, 0.2) 100%);
      `;
    }
  }}
`;

export default Glass;
