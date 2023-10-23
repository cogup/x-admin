import React from 'react';
import styled from 'styled-components';

interface BlurProps {
  $lines: number;
}

const Blur = styled.div<BlurProps>`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  z-index: -1;
  opacity: 0;
  transition: opacity 1s ease-in-out;

  &.overlay {
    opacity: 1;

    // first div
    ${({ $lines }) => {
      const stl = [];

      const valueHeight = 100 / $lines;
      const valueBluer = 5;

      for (let i = 1; i <= $lines; i++) {
        // opacity deve respitar o valor total, ou seja, se o valor total for 10, o primeiro deve ser 1, o segundo 0.9, o terceiro 0.8 e assim por diante, mas se o valor total for 3 o primeiro deve ser 1, o segundo 0.5 e o terceiro 0
        const valueOpacity = (1 - (i - 1) / ($lines - 1)) * 3;

        stl.push(`
      div:nth-child(${i}) {
                backdrop-filter: blur(${valueBluer}px);
                box-shadow: 0 0px 10px 0 rgba(0, 0, 0, 0.1);
                width: 100%;
                height: ${valueHeight}%;
                opacity: ${valueOpacity};
            }
    `);
      }

      return stl.join('\n');
    }}
  }
`;

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 63px;
`;

export interface GradientBlurProps {
  children?: React.ReactNode;
  overlay?: boolean;
}

const GradientBlur = ({
  children,
  overlay
}: GradientBlurProps): React.ReactElement => {
  const totalLines = 63;

  const renderLines = () => {
    const lines = [];

    for (let i = 1; i <= totalLines; i++) {
      lines.push(<div key={i} />);
    }

    return lines;
  };

  return (
    <Wrapper>
      <Blur $lines={totalLines} className={overlay ? 'overlay' : ''}>
        {renderLines()}
      </Blur>
      {children}
    </Wrapper>
  );
};

export default GradientBlur;
