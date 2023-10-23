import React, { useEffect, useState } from 'react';
import { Form, Input, Space, theme, Typography, ColorPicker } from 'antd';
import { StepProps } from '../../components/Steps';
import { Color } from 'antd/es/color-picker';
import { Theme, useDataSync } from '../../utils/sync';
import { DataType } from '../../utils/sync';
import ThemeSelect from './components/ThemeSelect';

const { Title } = Typography;

const SettingTheme = (props: StepProps): React.ReactElement => {
  const { data, updateData } = useDataSync();

  const [form] = Form.useForm();
  const [backgroundImage, setBackgroundImage] = useState<string | undefined>(
    data.backgroundImage
  );
  const [primaryColor, setPrimaryColor] = useState<string | undefined>(
    data.primaryColor
  );
  const [themeSelected, setThemeSelected] = useState<Theme>(
    data.theme ?? Theme.LIGHT
  );
  const { token } = theme.useToken();

  useEffect(() => {
    props.nextBottomActive(true);
  }, []);

  useEffect(() => {
    updateData(DataType.PRIMARY_COLOR, primaryColor);
    updateData(DataType.BACKGROUND_IMAGE, backgroundImage);
    updateData(DataType.THEME, themeSelected);

    props.setData({
      primaryColor,
      backgroundImage,
      theme: themeSelected
    });
  }, [backgroundImage, primaryColor, themeSelected]);

  const submitUrl = async () => {
    const url = form.getFieldValue('url');
    setBackgroundImage(url);
  };

  const onChangeColor = (color: Color) => {
    setPrimaryColor(color.toRgbString());
  };

  const onBackgrounImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBackgroundImage(e.target.value);
  };

  const onThemeSelect = (theme: Theme) => {
    setThemeSelected(theme);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      name="validateOnly"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minWidth: '30vw',
        border: 'none'
      }}
      onFinish={submitUrl}
    >
      <Space direction="vertical">
        <Title level={4}>Chose a primary color</Title>
        <Space direction="vertical">
          <ColorPicker
            showText
            defaultValue={token.colorPrimary}
            onChangeComplete={onChangeColor}
            disabledAlpha={true}
          />
        </Space>
      </Space>

      <Space
        direction="vertical"
        style={{
          marginTop: '2rem'
        }}
      >
        <Title level={4}>Chose a theme</Title>
        <ThemeSelect onSelect={onThemeSelect} />
      </Space>

      <Space direction="vertical" style={{ marginTop: '2rem' }}>
        <Title level={4}>Would you like to use an image as a background?</Title>
        <Input
          onChange={onBackgrounImageChange}
          placeholder="ex: https://unsplash.com/en/fotogra..."
          style={
            backgroundImage
              ? {
                  background: token.colorSuccessBg,
                  color: token.colorSuccessText,
                  borderColor: token.colorSuccessBorder
                }
              : undefined
          }
        />
      </Space>
    </Form>
  );
};

export default SettingTheme;
