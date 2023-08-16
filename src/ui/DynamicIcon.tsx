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

      return { default: Icon as AntdIconComponent };
    });
  }, [iconName]);

  return (
    <Suspense fallback={<div>... </div>}>
      <IconComponent style={style} />
    </Suspense>
  );
};

export default DynamicIcon;
