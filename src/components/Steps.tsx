import React, { useState } from 'react';
import { Button, message, Steps, theme } from 'antd';
import { type Resource, type Controller, Step } from '../controller';

interface StepsMakerProps {
  steps: Step[];
  controller: Controller;
}

const StepsMaker: React.FC<StepsMakerProps> = ({
  steps,
  controller
}): React.ReactElement => {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);

  const stepss = [
    {
      title: 'First',
      content: 'First-content'
    },
    {
      title: 'Second',
      content: 'Second-content'
    },
    {
      title: 'Last',
      content: 'Last-content'
    }
  ];

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const items = stepss.map((item) => ({ key: item.title, title: item.title }));

  const contentStyle: React.CSSProperties = {
    lineHeight: '260px',
    textAlign: 'center',
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16
  };

  return (
    <>
      <Steps current={current} items={items} />
      <div style={contentStyle}>{stepss[current].content}</div>
      <div style={{ marginTop: 24 }}>
        {current < stepss.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            Next
          </Button>
        )}
        {current === stepss.length - 1 && (
          <Button
            type="primary"
            onClick={() => message.success('Processing complete!')}
          >
            Done
          </Button>
        )}
        {current > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
            Previous
          </Button>
        )}
      </div>
    </>
  );
};

export default StepsMaker;
