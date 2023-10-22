import React from 'react';
import { Form, Button, theme } from 'antd';
import type { FormInstance } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface SubmitButtonProps {
  form: FormInstance;
  loading?: boolean;
  success?: boolean;
}

const SubmitButton = ({
  form,
  loading,
  success = false
}: SubmitButtonProps): React.ReactElement => {
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

export default SubmitButton;
