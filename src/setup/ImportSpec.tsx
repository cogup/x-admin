import React, { useEffect } from 'react';
import { Form, Input } from 'antd';
import { StepProps } from '../components/Steps';
import axios from 'axios';
import { OpenAPI } from '../controller/openapi';
import { Alert, Space } from 'antd';
import { Button, message, theme } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import type { FormInstance } from 'antd';

const { Search } = Input;

const SubmitButton = ({
  form,
  loading,
  success = false
}: {
  form: FormInstance;
  loading: boolean;
  success?: boolean;
}) => {
  const [submittable, setSubmittable] = React.useState(false);

  const {
    token: { colorSuccessText, colorSuccessBg, colorSuccessBorder }
  } = theme.useToken();

  // Watch all values
  const values = Form.useWatch([], form);

  React.useEffect(() => {
    form
      .validateFields({
        validateOnly: true
      })
      .then(
        () => {
          setSubmittable(true);
        },
        () => {
          setSubmittable(false);
        }
      );
  }, [values]);

  return (
    <Button
      type="primary"
      style={
        success
          ? {
              background: colorSuccessBg,
              color: colorSuccessText,
              borderColor: colorSuccessBorder,
              boxShadow: 'none'
            }
          : undefined
      }
      htmlType="submit"
      disabled={!submittable}
    >
      {loading && <LoadingOutlined />} Get!
    </Button>
  );
};

const ImportSpec = (props: StepProps): React.ReactElement => {
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [form] = Form.useForm();
  const [urlSuccess, setUrlSuccess] = React.useState<boolean>(false);
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

      if (specification === undefined || specification.openapi !== '3.0.0') {
        throw new Error('Invalid OpenAPI Specification');
      }

      props.setData({ ...specification });
      props.nextBottom(true);
      setUrlSuccess(true);
    } catch (e: any) {
      messageApi.open({
        type: 'error',
        content: e.message
      });
    }

    setLoading(false);
  };

  const renderError = () => {
    return (
      <Alert
        message="Error Text"
        description="Error Description Error Description Error Description Error Description Error Description Error Description"
        type="error"
        closable
        onClose={() => setError(null)}
      />
    );
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
      <Form.Item
        name="url"
        label="Enter with openapi Specification URL"
        rules={[
          { required: true },
          { type: 'url' },
          { type: 'string', min: 6 }
        ]}
      >
        <Space.Compact style={{ width: '100%' }}>
          <Input
            placeholder="ex: https://x-admin.github.com/openapi-demo.json"
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
      {error !== null && renderError()}
    </Form>
  );
};

export default ImportSpec;
