import React from 'react';
import {
  Input,
  InputNumber,
  Checkbox,
  Select,
  DatePicker,
  TimePicker,
  Slider,
  Upload,
  Button
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import TextAreaModal from './TextAreaModal';
import { type Schema } from '../controller';
import dayjs from 'dayjs';
import { CodeEditor } from './CodeEditor';

const { Option } = Select;
const { TextArea } = Input;

interface DynamicInputProps {
  schema: Schema | null;
  onChange: (value: any) => void;
  initialValues?: any;
  disabled?: boolean;
  label: string;
}

const DynamicInput: React.FC<DynamicInputProps> = ({
  schema,
  onChange,
  initialValues,
  disabled,
  label
}) => {
  if (schema == null) {
    return null;
  }

  const { type, ...schemaItem } = schema;

  if (type === undefined) {
    return null;
  }

  const handleFormat = (): React.ReactElement | null => {
    const { format } = schemaItem;
    if (format === 'date') {
      return <DatePicker onChange={onChange} disabled={disabled} />;
    } else if (format === 'date-time') {
      return (
        <DatePicker
          showTime
          format="YYYY-MM-DDTHH:mm:ssZ"
          onChange={onChange}
          disabled={disabled}
          defaultValue={dayjs(initialValues)}
        />
      );
    } else if (format === 'time') {
      return (
        <TimePicker
          onChange={onChange}
          disabled={disabled}
          defaultValue={dayjs(initialValues, 'HH:mm:ss')}
        />
      );
    }
    return null;
  };

  const renderEnumInput = (): React.ReactElement => {
    return (
      <Select
        style={{ width: '100%' }}
        placeholder="Selecione uma opção"
        onChange={onChange}
        defaultValue={initialValues}
        disabled={disabled}
      >
        {schemaItem.enum?.map((item, index) => (
          <Option key={index} value={item}>
            {item}
          </Option>
        ))}
      </Select>
    );
  };

  const isPassword = (): boolean => {
    const { format } = schemaItem;
    if (
      format === 'password' ||
      label?.toLowerCase().includes('password') ||
      label?.toLowerCase().includes('secret') ||
      label?.toLowerCase().includes('pass')
    ) {
      return true;
    }

    return false;
  };

  const renderColorInput = (): React.ReactElement => {
    return (
      <Input
        type="color"
        onChange={onChange}
        defaultValue={initialValues ?? '#000000'}
        disabled={disabled}
      />
    );
  };

  const renderStringInput = (): React.ReactElement => {
    const { format } = schemaItem;
    const AdminType = schemaItem['ohdash-type'];

    if (format === 'color') {
      return renderColorInput();
    }

    const formattedInput = handleFormat();
    if (formattedInput != null) {
      return formattedInput;
    }

    if (schemaItem.enum != null) {
      return renderEnumInput();
    }

    if (schemaItem.format === 'binary') {
      return renderFileInput();
    }

    if (AdminType === 'code') {
      return renderCodeInput();
    }

    if (schemaItem.maxLength !== undefined) {
      return isPassword() ? (
        <Input.Password
          maxLength={schemaItem.maxLength}
          onChange={(e): void => {
            onChange(e.target.value);
          }}
          defaultValue={initialValues}
          disabled={disabled}
        />
      ) : (
        <Input
          maxLength={schemaItem.maxLength}
          onChange={(e): void => {
            onChange(e.target.value);
          }}
          defaultValue={initialValues}
          disabled={disabled}
          type={getInputStringType()}
        />
      );
    }

    return renderTextAreaInput();
  };

  const getInputStringType = (): string => {
    const lowerLabel = label.toLowerCase();
    if (
      lowerLabel === 'url' ||
      lowerLabel === 'link' ||
      lowerLabel === 'href' ||
      lowerLabel === 'uri' ||
      lowerLabel === 'website' ||
      lowerLabel === 'web' ||
      lowerLabel === 'webpage'
    ) {
      return 'url';
    } else if (
      lowerLabel === 'email' ||
      lowerLabel === 'mail' ||
      lowerLabel === 'e-mail'
    ) {
      return 'email';
    } else if (lowerLabel === 'phone' || lowerLabel === 'telephone') {
      return 'tel';
    } else if (lowerLabel === 'password' || lowerLabel === 'secret') {
      return 'password';
    }

    return 'text';
  };

  const renderNumberInput = (): React.ReactElement | null => {
    if (schemaItem.minimum !== undefined && schemaItem.maximum !== undefined) {
      return renderSliderInput();
    }

    if (schemaItem.enum != null) {
      return renderEnumInput();
    }

    return (
      <InputNumber
        min={schemaItem.minimum}
        max={schemaItem.maximum}
        step={type === 'integer' ? 1 : 0.01}
        onChange={onChange}
        defaultValue={initialValues}
        disabled={disabled}
      />
    );
  };

  const renderBooleanInput = (): React.ReactElement | null => (
    <Checkbox
      onChange={(e): void => {
        onChange(e.target.value);
      }}
      defaultChecked={initialValues}
      disabled={disabled}
    />
  );

  const renderArrayInput = (): React.ReactElement | null => {
    const { items } = schemaItem;
    if (items?.enum != null) {
      return (
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Selecione os itens"
          onChange={onChange}
          defaultValue={initialValues}
          disabled={disabled}
        >
          {items.enum.map((item, index) => (
            <Option key={index} value={item}>
              {item}
            </Option>
          ))}
        </Select>
      );
    }
    return null;
  };

  const renderObjectInput = (): React.ReactElement | null => (
    <TextArea
      placeholder="Insira um objeto JSON"
      onChange={(e): void => {
        onChange(e.target.value);
      }}
      defaultValue={initialValues}
      autoSize={{ minRows: 3, maxRows: 6 }}
      disabled={disabled}
    />
  );

  const renderSliderInput = (): React.ReactElement | null => {
    return (
      <Slider
        min={schemaItem.minimum ?? 0}
        max={schemaItem.maximum ?? 100}
        onChange={onChange}
        defaultValue={initialValues ?? 0}
        disabled={disabled}
      />
    );
  };

  const renderFileInput = (): React.ReactElement => {
    const handleFileChange = (info: any): void => {
      if (info.file.status === 'done') {
        onChange(info.file.originFileObj);
      }
    };

    const fileUploadProps = {
      beforeUpload: () => false,
      onChange: handleFileChange,
      showUploadList: false
    };

    return (
      <Upload {...fileUploadProps}>
        <Button icon={<UploadOutlined />} disabled={disabled}>
          Click to Upload
        </Button>
      </Upload>
    );
  };

  const renderTextAreaInput = (): React.ReactElement => {
    return (
      <TextAreaModal
        onChange={onChange}
        defaultValue={initialValues}
        disabled={disabled}
        label={label}
      />
    );
  };

  const renderCodeInput = (): React.ReactElement => {
    return <CodeEditor onChange={onChange} defaultValue={initialValues} />;
  };
  const inputTypeMap = {
    string: renderStringInput,
    integer: renderNumberInput,
    number: renderNumberInput,
    boolean: renderBooleanInput,
    array: renderArrayInput,
    object: renderObjectInput
  };

  return inputTypeMap[type]?.() ?? null;
};

export default DynamicInput;
