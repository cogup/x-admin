import React, { useEffect } from 'react';
import {
  Form,
  Input,
  Space,
  theme,
  Typography,
  ColorPicker
  // Switch
} from 'antd';
import { StepProps } from '../../components/Steps';
// import SubmitButton from '../../components/SubmitButton';
import { Color } from 'antd/es/color-picker';
import { useDataSync } from '../../utils/sync';

const { Title } = Typography;

const SettingTheme = (props: StepProps): React.ReactElement => {
  const { data, updateData } = useDataSync();

  const [form] = Form.useForm();
  const [backgroundImage, setBackgroundImage] = React.useState<
    string | undefined
  >(undefined);
  const [primaryColor, setPrimaryColor] = React.useState<string | undefined>(
    undefined
  );
  // const [activeGradient, setActiveGradient] = React.useState<boolean>(false);
  const { token } = theme.useToken();

  props.nextBottom(true);

  useEffect(() => {
    updateData({
      ...data,
      primaryColor: primaryColor,
      backgroundImage: backgroundImage
    });

    props.setData({
      primaryColor,
      backgroundImage
    });
  }, [backgroundImage, primaryColor]);

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
          />
        </Space>
      </Space>

      {/* <Space direction="vertical">
        <Title level={4} style={{ marginTop: '1rem' }}>
          Would you like to use a gradient without a background?
        </Title>
        <Switch
          onChange={onChangeGradient}
          size="default"
          defaultChecked={false}
          checkedChildren="Yes!"
          unCheckedChildren="No, thanks"
        />
      </Space> */}

      <Space direction="vertical">
        <Title level={4} style={{ marginTop: '1rem' }}>
          Would you like to use an image as a background?
        </Title>
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
