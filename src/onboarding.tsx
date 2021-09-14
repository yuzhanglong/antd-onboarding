import React, { useCallback, useEffect, useState } from 'react';
import Mask from './mask';
import ReactDOM from 'react-dom';
import { Button, Popover } from 'antd';
import { TooltipPlacement } from 'antd/es/tooltip';
import { MASK_ANIMATION_TIME } from './const';

interface OnBoardingStepConfig {
  selector: () => HTMLElement | null;
  container?: () => HTMLElement | null;
  onStepIn?: () => void;
  placement: TooltipPlacement;
}

interface OnBoardingProps {
  steps: OnBoardingStepConfig[];
}

enum OnBoardingStatus {
  // 未开始，例如暂未查找到步骤的节点
  NOT_READY,

  // 已经准备好
  READY,

  // 流程结束
  END
}

const OnBoarding: React.FC<OnBoardingProps> = (props) => {
  const { steps } = props;

  // 当前状态
  const [currentStatus, setCurrentStatus] = useState<OnBoardingStatus>(OnBoardingStatus.NOT_READY);

  // 当前步骤(step index)
  const [currentStep, setCurrentStep] = useState<number>(0);

  // 用于渲染
  const [renderTick, setRenderTick] = useState<number>(0);

  // mask 是否在移动
  const [isMaskMoving, setIsMaskMoving] = useState<boolean>(false);

  // 选择配置的元素
  const getCurrentTargetElement = useCallback(() => {
    return steps[currentStep]?.selector();
  }, [currentStep]);

  useEffect(() => {
    initCurrentSelectedElement();
  }, [renderTick]);

  // 获取当前步骤
  const getCurrentStep = () => {
    return steps[currentStep];
  };

  // 重置 mask 状态
  const resetMaskStatus = () => {
    setIsMaskMoving(true);
    setTimeout(() => {
      setIsMaskMoving(false);
    }, MASK_ANIMATION_TIME);
  };

  const initCurrentSelectedElement = () => {
    if (!getCurrentTargetElement()) {
      // MutationObserver 会不会更合理？可以考虑做个 benchmark
      setRenderTick(renderTick + 1);
    } else {
      setCurrentStatus(OnBoardingStatus.READY);
    }
  };

  const prev = () => {
    // 如果是第一步，我们不应该往前走
    if (currentStep === 0) {
      return;
    }

    setCurrentStep(currentStep - 1);
    resetMaskStatus();
  };

  const next = () => {
    // 如果是最后一步
    if (currentStep === steps.length - 1) {
      setCurrentStatus(OnBoardingStatus.END);
      return;
    }

    setCurrentStep(currentStep + 1);
    resetMaskStatus();
  };

  const renderPopover = (wrapper: React.ReactNode) => {
    return !isMaskMoving ? (
      <Popover
        content={
          <div>
            <div>
              {currentStep}/{steps.length - 1}
            </div>
            <Button onClick={() => {
              prev();
            }}>
              Back
            </Button>
            <Button type={'primary'} onClick={() => {
              next();
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
    currentStatus === OnBoardingStatus.READY ? <Mask
      element={getCurrentTargetElement() || document.body}
      renderMaskContent={(wrapper) => renderPopover(wrapper)} /> : null,
    document.body
  );
};

export default OnBoarding;
