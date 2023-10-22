import React, { useState } from 'react';
import { Form, Input, Space, message, theme, Divider, Typography } from 'antd';
import { StepProps } from '../../components/Steps';
import axios from 'axios';
import { OpenAPI } from '../../controller/openapi';
import UploadSpec from './UploadSpec';
import SubmitButton from '../../components/SubmitButton';

const { Title } = Typography;

// Verifica se o objeto é uma especificação OpenAPI válida, com versão maior ou igual a 3.0.0
const validateOpenAPI = (specification: any) => {
  if (
    specification === undefined ||
    typeof specification.openapi !== 'string'
  ) {
    throw new Error('Invalid OpenAPI Specification');
  }
};

const ImportSpec = (props: StepProps): React.ReactElement => {
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [urlSuccess, setUrlSuccess] = useState<boolean>(false);
  const [fileSuccess, setFileSuccess] = useState<boolean>(false);
  const [defaultUrl, setDefaultUrl] = useState<string | undefined>(
    props.currentData?.specification?.url
  );
  const {
    token: { colorSuccessText, colorSuccessBg, colorSuccessBorder }
  } = theme.useToken();

  const [messageApi, contextHolder] = message.useMessage();

  const submitUrl = async () => {
    setLoading(true);

    const url = form.getFieldValue('url');
    setUrlSuccess(false);
    props.nextBottom(false);

    try {
      const response = await axios.get(url as string);
      const specification = response.data as OpenAPI;

      validateOpenAPI(specification);

      props.setData({ specification, url });
      props.nextBottom(true);
      setDefaultUrl(url);
      setUrlSuccess(true);
      setFileSuccess(false);
    } catch (e: any) {
      messageApi.open({
        type: 'error',
        content: e.message
      });
    }

    setLoading(false);
  };

  const onUpload = (file: string) => {
    setFileSuccess(false);

    try {
      const specification = JSON.parse(file) as OpenAPI;

      validateOpenAPI(specification);

      props.setData({ specification });
      props.nextBottom(true);
      setFileSuccess(true);
      setUrlSuccess(false);
    } catch (e: any) {
      messageApi.open({
        type: 'error',
        content: e.message
      });
    }
  };

  const onRemoveFile = () => {
    if (fileSuccess) {
      setFileSuccess(false);
      props.nextBottom(false);
      props.setData({});
    }
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
      {contextHolder}
      <Title level={4}>Use a url from an OpenAPI specification</Title>
      <Form.Item
        name="url"
        rules={[
          { required: true },
          { type: 'url' },
          { type: 'string', min: 6 }
        ]}
      >
        <Space.Compact style={{ width: '100%' }}>
          <Input
            placeholder="ex: https://x-admin.github.com/openapi-demo.json"
            defaultValue={defaultUrl}
            style={
              urlSuccess
                ? {
                    background: colorSuccessBg,
                    color: colorSuccessText,
                    borderColor: colorSuccessBorder
                  }
                : undefined
            }
          />
          <SubmitButton form={form} loading={loading} success={urlSuccess} />
        </Space.Compact>
      </Form.Item>
      <Divider plain>Or</Divider>
      <UploadSpec
        onUpload={onUpload}
        success={fileSuccess}
        onRemove={onRemoveFile}
      />
    </Form>
  );
};

export default ImportSpec;
