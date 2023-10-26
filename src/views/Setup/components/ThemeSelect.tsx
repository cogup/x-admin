import React from 'react';
import { Theme, useDataSync } from '../../../utils/sync';
import styled from 'styled-components';
import Logo from '../../../assets/Logo';
import getThemes, { CustomColors, customColors } from '../../../themes';
import { GlobalToken, theme } from 'antd';

export interface ThemeSelectProps {
  onSelect: (theme: Theme) => void;
}

interface ThemeSelectWrapperProps {
  $token: GlobalToken;
  $customColors: CustomColors;
  $selected?: Theme;
}

const ThemeSelectWrapper = styled.div<ThemeSelectWrapperProps>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 8px;

  div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 1px solid ${(props) => props.$token.colorBorder};
    border-radius: ${(props) => props.$token.borderRadiusLG}px;
    flex: 1;
    height: 80px;
    width: 80px;
    position: relative;
    transition: all 0.2s ease-in-out;

    &:hover {
      cursor: pointer;
      box-shadow: 0 0 0 2px ${(props) => props.$token.colorPrimary};
    }

    svg {
      width: 30px;
      height: 30px;
    }

    margin: 0 10px;

    &.light {
      background: ${(props) => {
        return `linear-gradient(135deg, ${props.$customColors.light.colorBgContainer} 50%, ${props.$token.colorPrimary} 50%)`;
      }};
      ${(props) => {
        if (props.$selected === Theme.LIGHT) {
          return `
            box-shadow: 0 0 0 2px ${props.$token.colorPrimary};
          `;
        }
      }}
    }

    &.lighting {
      background: ${(props) => {
        return `linear-gradient(135deg, ${props.$customColors.dark.colorBgContainer} 50%, ${props.$token.colorPrimary} 50%)`;
      }};
      ${(props) => {
        if (props.$selected === Theme.LIGHTING) {
          return `
            box-shadow: 0 0 0 2px ${props.$token.colorPrimary};
          `;
        }
      }}
    }

    &.dark {
      background-color: ${(props) => props.$customColors.dark.colorBgContainer};
      ${(props) => {
        if (props.$selected === Theme.DARK) {
          return `
            box-shadow: 0 0 0 2px ${props.$token.colorPrimary};
          `;
        }
      }}
    }

    &.darker {
      background: ${(props) => {
        return `linear-gradient(135deg, ${props.$customColors.light.colorBgContainer} 50%, ${props.$customColors.dark.colorBgContainer} 50%)`;
      }};
      ${(props) => {
        if (props.$selected === Theme.DARKER) {
          return `
            box-shadow: 0 0 0 2px ${props.$token.colorPrimary};
          `;
        }
      }}
    }
  }
`;

const ThemeSelect = (props: ThemeSelectProps): React.ReactElement => {
  const { data } = useDataSync();
  const themes = getThemes(data);
  const { token } = theme.useToken();

  return (
    <ThemeSelectWrapper
      $token={token}
      $customColors={customColors}
      $selected={data.theme ?? Theme.DARK}
    >
      <div onClick={() => props.onSelect(Theme.LIGHT)} className="light"></div>

      <div
        onClick={() => props.onSelect(Theme.LIGHTING)}
        className="lighting"
      ></div>

      <div onClick={() => props.onSelect(Theme.DARK)} className="dark"></div>

      <div
        onClick={() => props.onSelect(Theme.DARKER)}
        className="darker"
      ></div>
    </ThemeSelectWrapper>
  );
};

export default ThemeSelect;
