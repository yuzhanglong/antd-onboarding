import React, { useCallback, useEffect, useState } from 'react';
import Mask from './mask';
import ReactDOM from 'react-dom';
import { Button, Popover } from 'antd';
import { TooltipPlacement } from 'antd/es/tooltip';

interface OnBoardingStepConfig {
  selector: () => HTMLElement | null;
  container?: () => HTMLElement | null;
  onStepIn?: () => void;
  placement: TooltipPlacement;
}

interface OnBoardingProps {
  steps: OnBoardingStepConfig[];
}

const OnBoarding: React.FC<OnBoardingProps> = (props) => {
  const { steps } = props;

  // 当前步骤
  const [currentStep, setCurrentStep] = useState<number>(-1);

  // 用于渲染
  const [renderTick, setRenderTick] = useState<number>(0);

  // mask 是否在移动
  const [isTaskMoving, setIsTaskMoving] = useState<boolean>(false);

  // 选择配置的元素
  const getCurrentTargetElement = useCallback(() => {
    return steps[currentStep]?.selector();
  }, [currentStep]);

  useEffect(() => {
    const initCurrentSelectedElement = () => {
      if (!getCurrentTargetElement()) {
        // MutationObserver 会不会更合理
        setRenderTick(renderTick + 1);
        setCurrentStep(0);
      }
    };

    initCurrentSelectedElement();
  }, [renderTick]);

  // 获取当前步骤
  const getCurrentStep = () => {
    return steps[currentStep];
  };


  const renderPopover = (wrapper: React.ReactNode) => {

    return currentStep >= 0 && !isTaskMoving ? (
      <Popover
        content={
          <div>
            <div>
              {currentStep}/{steps.length - 1}
            </div>
            <Button onClick={() => {
              setCurrentStep(currentStep - 1);

              setIsTaskMoving(true);
              setTimeout(() => {
                setIsTaskMoving(false);
              }, 200);
            }}>
              Back
            </Button>
            <Button type={'primary'} onClick={() => {
              setCurrentStep(currentStep + 1);

              setIsTaskMoving(true);
              setTimeout(() => {
                setIsTaskMoving(false);
              }, 200);
            }}>
              Next
            </Button>
          </div>
        }
        visible={true}
        placement={getCurrentStep()?.placement}>
        {wrapper}
      </Popover>
    ) : wrapper;
  };

  return ReactDOM.createPortal(
    currentStep >= 0 ? <Mask
      element={getCurrentTargetElement() || document.body}
      renderMaskContent={(wrapper) => renderPopover(wrapper)} /> : null,
    document.body
  );
};

export default OnBoarding;
