import React, { useEffect, useState } from 'react';
import { Button, message, Steps, theme } from 'antd';
import { type Controller } from '../controller';

export interface Step {
  key: string;
  title: string;
  content: StepNode;
}

interface StepsMakerProps {
  steps: Step[];
  onNext?: (data: any) => void;
  onDone?: (data: any) => void;
  confirmToNext?: boolean;
  controller?: Controller;
}

export interface StepProps {
  setData: (data: Record<string, any>) => void;
  currentData: Record<string, any>;
  next?: () => void;
  prev?: () => void;
}

export type StepNode = (props: StepProps) => React.ReactElement;

const StepsMaker: React.FC<StepsMakerProps> = ({
  steps,
  controller,
  onDone,
  onNext
}): React.ReactElement => {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const [stepData, setStepData] = useState<Record<string, any>>({});

  useEffect(() => {
    if (current === steps.length - 1 && onDone !== undefined) {
      onDone(stepData);
    } else if (current < steps.length - 1 && onNext !== undefined) {
      onNext(stepData);
    }
  }, [current]);

  const setData = (data: Record<string, any>) => {
    const newData = {
      [steps[current].key]: data
    };
    setStepData({ ...stepData, ...newData });
  };

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const done = () => {
    if (onDone !== undefined) {
      onDone(stepData);
    }
  };

  const stepProps = steps.map((item, i) => ({
    key: item.key,
    title: item.title
  }));

  const contentStyle: React.CSSProperties = {
    lineHeight: '260px',
    textAlign: 'center',
    color: token.colorTextTertiary,
    backgroundColor: token.colorBgBase,
    borderRadius: token.borderRadiusLG,
    marginTop: 16,
    padding: '2rem',
    width: '100%'
  };

  const CurrentStep = steps[current].content;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <Steps current={current} items={stepProps} />
      <div style={contentStyle}>
        <CurrentStep
          setData={setData}
          currentData={stepData}
          next={next}
          prev={prev}
        />
      </div>
      <div
        style={{
          marginTop: 24,
          display: 'flex',
          flexDirection: 'row-reverse',
          justifyContent: 'space-between',
          width: '100%'
        }}
      >
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={() => done()}>
            Done
          </Button>
        )}
        {current > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
            Previous
          </Button>
        )}
      </div>
    </div>
  );
};

export default StepsMaker;
