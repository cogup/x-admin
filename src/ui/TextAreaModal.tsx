import React, { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Modal, theme } from 'antd';
import ReactQuill from 'react-quill';
import hljs from 'highlight.js';
import { FullscreenOutlined } from '@ant-design/icons';
import TurndownService from 'turndown';
import { marked } from 'marked';

import 'react-quill/dist/quill.snow.css';
import 'highlight.js/styles/idea.css';
import styled from 'styled-components';

interface TextAreaWithQuillModalProps {
  label?: string;
  defaultValue: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

interface TextAreaStyledProps {
  colorWhite: string;
  colorPrimary: string;
}

const TextAreaStyled = styled.div<TextAreaStyledProps>`
  .ql-fullscreen,
  .ql-fullscreen:active,
  .ql-fullscreen:focus,
  .ql-fullscreen:hover,
  .ql-fullscreen:visited {
    cursor: pointer !important;
    float: right !important;
    color: ${({ colorWhite }) => colorWhite} !important;
    background: ${({ colorPrimary }) => colorPrimary} !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    border-radius: 6px !important;
    font-size: 16px !important;
  }
`;

interface EditorProps {
  disabled?: boolean;
  colorBgContainerDisabled?: string;
  colorTextDisabled?: string;
}

const Editor = styled(ReactQuill)<EditorProps>`
  height: 100% !important;
  width: 100%;

  ${({ disabled, colorBgContainerDisabled, colorTextDisabled }) =>
    disabled === true &&
    colorBgContainerDisabled !== undefined &&
    colorTextDisabled !== undefined &&
    `
        .ql-editor {
            background-color: ${colorBgContainerDisabled};
            color: ${colorTextDisabled};
        }
    `}

  .ql-editor, .ql-container {
    height: calc(100% - 50px);
    width: 100%;
  }

  .ql-fullscreen {
    cursor: pointer;
    display: inline-block;
    vertical-align: middle;
    margin-top: 0px;
  }

  .ql-toolbar span {
    float: left;
  }
`;

hljs.configure({
  languages: [
    'javascript',
    'python',
    'rhay',
    'html',
    'css',
    'json',
    'xml',
    'markdown',
    'java',
    'php',
    'sql',
    'typescript',
    'yaml',
    'bash',
    'c',
    'csharp',
    'cpp',
    'go',
    'kotlin',
    'lua',
    'perl',
    'ruby',
    'rust',
    'scala',
    'swift',
    'dart',
    'dockerfile',
    'elixir',
    'erlang',
    'haskell',
    'julia',
    'matlab',
    'objectivec',
    'powershell',
    'r',
    'shell',
    'vbnet',
    'plaintext'
  ]
});

function markdownToHtml(markdown: string): string {
  if (markdown) {
    //TODO: Fix this
    //@ts-ignore
    const html = marked.setOptions({ mangle: false }).parse(markdown);
    return html;
  } else {
    return markdown;
  }
}

const TextAreaWithQuillModal: React.FC<TextAreaWithQuillModalProps> = ({
  label,
  defaultValue,
  onChange,
  disabled
}) => {
  const {
    token: {
      colorBgContainerDisabled,
      colorTextDisabled,
      colorPrimary,
      colorWhite
    }
  } = theme.useToken();
  const editorRef = useRef<ReactQuill | null>(null);
  const [quillValue, setQuillValue] = useState<string>(
    markdownToHtml(defaultValue)
  );
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const addFullScreenIcon = (): void => {
    const quill = editorRef.current?.getEditor();
    const toolbar = quill?.getModule('toolbar');

    if (toolbar?.container !== undefined) {
      const fullScreenButton = document.createElement('button');
      const iconContainer = document.createElement('span');

      fullScreenButton.appendChild(iconContainer);
      fullScreenButton.classList.add('ql-fullscreen');
      fullScreenButton.addEventListener('click', showModal);
      toolbar.container.appendChild(fullScreenButton);
      const root = createRoot(iconContainer);
      root.render(<FullscreenOutlined />);
    }
  };

  useEffect((): void => {
    if (editorRef.current == null) {
      return;
    }

    addFullScreenIcon();
  }, []);

  const showModal = (e: any): void => {
    e.preventDefault();
    setIsModalVisible(true);
  };

  const handleCancel = (): void => {
    setIsModalVisible(false);
  };

  const onChangeLocal = (value: string): void => {
    const turndownService = new TurndownService();
    const markdown = turndownService.turndown(value);

    setQuillValue(value);
    onChange(markdown);
  };

  const getLabel = (): string => {
    if (label !== undefined) {
      return label;
    }

    return 'Editor';
  };

  return (
    <TextAreaStyled colorPrimary={colorPrimary} colorWhite={colorWhite}>
      <Editor
        ref={editorRef}
        value={quillValue}
        onChange={onChangeLocal}
        modules={quillModules}
        readOnly={disabled}
        colorTextDisabled={colorTextDisabled}
        colorBgContainerDisabled={colorBgContainerDisabled}
      />
      <Modal
        title={getLabel()}
        open={isModalVisible}
        onCancel={handleCancel}
        width="80vw"
        footer={null}
        bodyStyle={{ width: '100%', height: '70vh' }}
      >
        <Editor
          value={quillValue}
          onChange={onChangeLocal}
          style={{ width: '100%', height: 'auto' }}
          modules={quillModules}
          readOnly={disabled}
          colorTextDisabled={colorTextDisabled}
          colorBgContainerDisabled={colorBgContainerDisabled}
        />
      </Modal>
    </TextAreaStyled>
  );
};

export default TextAreaWithQuillModal;

const quillModules = {
  toolbar: [
    [
      { header: [1, 2, 3, 4, 5, 6, false] },
      'bold',
      'italic',
      'underline',
      'strike',
      'blockquote',
      'code-block',
      'link',
      { list: 'ordered' },
      { list: 'bullet' },
      'image'
    ]
  ],
  syntax: {
    highlight: (text: string): string => hljs.highlightAuto(text).value
  }
};
