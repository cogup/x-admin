import { theme } from 'antd';
import React from 'react';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Container = ({
  children,
  style,
  ...props
}: ContainerProps): React.ReactElement => {
  const { token } = theme.useToken();

  return (
    <div
      style={{
        ...style,
        borderRadius: token.borderRadiusLG,
        backgroundColor: token.colorBgContainer,
        border: `1px solid ${token.colorBorderSecondary}`
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Container;
