import React, { useEffect, useState } from 'react';
import { Form, Input, Space, message, theme, Divider, Typography } from 'antd';
import { StepProps } from '../../components/Steps';
import axios from 'axios';
import { OpenAPI } from '../../controller/openapi';
import UploadSpec from './UploadSpec';
import SubmitButton from '../../components/SubmitButton';
import { DataType, useDataSync } from '../../utils/sync';

const { Title } = Typography;

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
  const { data, updateData } = useDataSync();
  const [urlSuccess, setUrlSuccess] = useState<boolean>(
    data.specificationUrl !== undefined
  );
  const [fileSuccess, setFileSuccess] = useState<boolean>(false);
  const [defaultUrl, setDefaultUrl] = useState<string | undefined>(
    data.specificationUrl
  );
  const {
    token: { colorSuccessText, colorSuccessBg, colorSuccessBorder }
  } = theme.useToken();
  const [messageApi, contextHolder] = message.useMessage();

  const submitUrl = async () => {
    setLoading(true);
    const specificationUrl = form.getFieldValue('url');
    setUrlSuccess(false);

    try {
      const response = await axios.get(specificationUrl as string);
      const specification = response.data as OpenAPI;

      validateOpenAPI(specification);

      props.setData({ specification, specificationUrl });
      updateData(DataType.SPECIFICATION_URL, specificationUrl);

      setDefaultUrl(specificationUrl);
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

      updateData(DataType.SPECIFICATION, specification);

      props.setData({ specification });

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
      props.setData({});
    }
  };

  useEffect(() => {
    props.nextBottomActive(fileSuccess || urlSuccess);
  }, [fileSuccess, urlSuccess]);

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
