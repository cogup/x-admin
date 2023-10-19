import React from 'react';
import { Form, Input } from 'antd';
import { StepProps } from '../components/Steps';

const AddUrl = (props: StepProps): React.ReactElement => {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.setData({ url: e.target.value });
  };

  return (
    <Form
      layout="vertical"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minWidth: '30vw',
        border: 'none'
      }}
    >
      <Form.Item
        name="url"
        label="Enter with openapi Specification URL"
        rules={[
          { required: true },
          { type: 'url', warningOnly: true },
          { type: 'string', min: 6 }
        ]}
      >
        <Input
          onChange={onChange}
          placeholder="ex: https://x-admin.github.com/openapi-demo.json"
        />
      </Form.Item>
    </Form>
  );
};

export default AddUrl;
