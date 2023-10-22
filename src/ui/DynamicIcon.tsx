import React, { type FC, Suspense, useMemo } from 'react';
import type { IconType } from './iconTypes';
import type { AntdIconProps } from '@ant-design/icons/lib/components/AntdIcon';

interface DynamicIconProps {
  iconName: IconType;
  style?: React.CSSProperties;
}

type AntdIconComponent = FC<AntdIconProps>;

const DynamicIcon: FC<DynamicIconProps> = ({ iconName, style }) => {
  const IconComponent = useMemo(() => {
    return React.lazy(async (): Promise<{ default: AntdIconComponent }> => {
      const { [iconName]: Icon } = await import('@ant-design/icons');

      if (Icon === undefined) {
        throw new Error(`Icon "${iconName}" not found.`);
      }

      const IconBuilded = Icon as AntdIconComponent;

      const IconComp = () => (
        <span
          style={{
            ...style,
            padding: '0 0.3rem'
          }}
        >
          <IconBuilded />
        </span>
      );

      return { default: IconComp };
    });
  }, [iconName]);

  return (
    <Suspense fallback={<div>...</div>}>
      <IconComponent />
    </Suspense>
  );
};

export default DynamicIcon;
