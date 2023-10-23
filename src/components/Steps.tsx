import React, { useState } from 'react';
import { Button, Steps, theme } from 'antd';
import Theming from './Theming';

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
  theming?: boolean;
}

export interface StepProps {
  setData: (data: Record<string, any>) => void;
  currentData: Record<string, any>;
  next?: () => void;
  prev?: () => void;
  nextBottomActive: (active: boolean) => void;
}

export type StepNode = (props: StepProps) => React.ReactElement;

interface StepContentProps {
  children: React.ReactNode;
}

const StepContent = (props: StepContentProps): React.ReactElement => {
  const { token } = theme.useToken();

  const contentStyle: React.CSSProperties = {
    textAlign: 'center',
    color: token.colorTextTertiary,
    backgroundColor: token.colorBgBase,
    borderRadius: token.borderRadiusLG,
    marginTop: 16,
    padding: '2rem',
    width: '100%'
  };

  return <div style={contentStyle}>{props.children}</div>;
};

const StepsMaker: React.FC<StepsMakerProps> = ({
  steps,
  onDone,
  onNext,
  theming
}): React.ReactElement => {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const [stepData, setStepData] = useState<Record<string, any>>({});
  const [nextActive, setNextActive] = useState<boolean>(false);

  const setData = (data: Record<string, any>) => {
    const newData = {
      [steps[current].key]: data
    };
    setStepData({ ...stepData, ...newData });
  };

  const next = () => {
    setCurrent(current + 1);
    if (onNext !== undefined) {
      onNext(stepData);
    }
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const done = () => {
    if (onDone !== undefined) {
      onDone(stepData);
    }
  };

  const onNextActive = (active: boolean) => {
    setNextActive(active);
  };

  const stepProps = steps.map((item, i) => ({
    key: i,
    title: item.title
  }));

  const CurrentStep = steps[current].content;

  const renderContent = () => {
    if (theming === true) {
      return (
        <Theming>
          <StepContent>
            <CurrentStep
              setData={setData}
              currentData={stepData}
              next={next}
              prev={prev}
              nextBottomActive={onNextActive}
            />
          </StepContent>
        </Theming>
      );
    }

    return (
      <StepContent>
        <CurrentStep
          setData={setData}
          currentData={stepData}
          next={next}
          prev={prev}
          nextBottomActive={onNextActive}
        />
      </StepContent>
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <Steps current={current} items={stepProps} />
      {renderContent()}

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
          <Button type="primary" onClick={() => next()} disabled={!nextActive}>
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={() => done()} disabled={!nextActive}>
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
