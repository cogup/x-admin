import React from 'react';
import {
  Form,
  Input,
  Space,
  Button,
  message,
  theme,
  Divider,
  Typography
} from 'antd';
import type { FormInstance } from 'antd';
import { StepProps } from '../../components/Steps';
import axios from 'axios';
import { OpenAPI } from '../../controller/openapi';
import { LoadingOutlined } from '@ant-design/icons';
import UploadSpec from './UploadSpec';

const { Title } = Typography;

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
  const [loading, setLoading] = React.useState<boolean>(false);
  const [form] = Form.useForm();
  const [urlSuccess, setUrlSuccess] = React.useState<boolean>(false);
  const [fileSuccess, setFileSuccess] = React.useState<boolean>(false);
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

      props.setData({ ...specification });
      props.nextBottom(true);
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

      props.setData({ ...specification });
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