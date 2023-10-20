import React from 'react';
import { InboxOutlined, LoadingOutlined } from '@ant-design/icons';
import { message, Upload, theme } from 'antd';

const loadFileOnBrowser = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };
    reader.onerror = (e) => {
      reject(e);
    };
    reader.readAsText(file);
  });
};

export interface UploadSpecProps {
  onUpload: (file: string) => void;
  onRemove: () => void;
  success?: boolean;
}

const UploadSpec = (props: UploadSpecProps): React.ReactElement => {
  const [loading, setLoading] = React.useState(false);
  const {
    token: { colorSuccessText, colorSuccessBg, colorFillSecondary }
  } = theme.useToken();

  const loadFile = async (file: File, FileList: any) => {
    setLoading(true);
    const data = await loadFileOnBrowser(file);
    setLoading(false);
    props.onUpload(data);
    message.success(`${file.name} file uploaded successfully`);
    return false;
  };

  const onRemove = () => {
    props.onRemove();
  };

  const renderLoading = () => {
    if (loading) {
      return <LoadingOutlined />;
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        background: props.success ? colorSuccessBg : colorFillSecondary,
        width: '100%',
        padding: '1rem'
      }}
    >
      <Upload
        name={'file'}
        multiple={false}
        beforeUpload={loadFile}
        onRemove={onRemove}
        maxCount={1}
      >
        <div
          style={{
            cursor: 'pointer',
            width: '100%',
            padding: '1rem'
          }}
        >
          <InboxOutlined
            style={{
              fontSize: '2.5rem',
              color: props.success ? colorSuccessText : undefined
            }}
          />
          <p>Click or drag file to this area to upload</p>
          {renderLoading()}
        </div>
      </Upload>
    </div>
  );
};

export default UploadSpec;
