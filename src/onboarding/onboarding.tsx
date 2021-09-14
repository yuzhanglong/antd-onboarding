import React, { useCallback, useEffect, useState } from 'react';
import Mask from '../mask/mask';
import ReactDOM from 'react-dom';
import { Button, Popover } from 'antd';
import { TooltipPlacement } from 'antd/es/tooltip';
import { MASK_ANIMATION_TIME } from '../const';
import PopoverContent, { PopoverContentProps } from './popover-content';
import './onboarding.scss';

interface OnBoardingStepConfig {
  // 选择的元素
  selector: () => HTMLElement | null;
  // mask 的容器
  container?: () => HTMLElement | null;
  // tooltip 的位置
  placement?: TooltipPlacement;
  // 内容
  renderContent?: (currentStep: number) => React.ReactNode;
}

interface OnBoardingProps {
  // 初始化步骤
  initialStep?: number;
  // 步骤配置
  steps: OnBoardingStepConfig[];
  // 是否展示默认操作模块(两个按钮，上一步 + 下一步)
  useDefaultOperations?: boolean;
  // 是否展示遮罩
  isShowMask?: boolean;
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
  const { steps, initialStep, useDefaultOperations = true, isShowMask = false } = props;

  // 当前状态
  const [currentStatus, setCurrentStatus] = useState<OnBoardingStatus>(OnBoardingStatus.NOT_READY);

  // 当前步骤(step index)
  const [currentStep, setCurrentStep] = useState<number>(initialStep || 0);

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
    return steps[currentStep] || {};
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
      setRenderTick(renderTick + 1);
    } else {
      setCurrentStatus(OnBoardingStatus.READY);
    }
  };

  const back = () => {
    // 如果是第一步，我们不应该往前走
    if (currentStep === 0) {
      return;
    }

    setCurrentStep(currentStep - 1);
    resetMaskStatus();
  };

  const forward = () => {
    // 如果是最后一步
    if (currentStep === steps.length - 1) {
      setCurrentStatus(OnBoardingStatus.END);
      return;
    }

    setCurrentStep(currentStep + 1);
    resetMaskStatus();
  };

  const renderPopover = (wrapper: React.ReactNode) => {
    const { renderContent } = getCurrentStep();
    const content = renderContent ? renderContent(currentStep) : null;

    const defaultOperation = (
      <div className={'onboarding-default-operation'}>
        <Button
          className={'back'}
          onClick={() => back()}>
          Back
        </Button>
        <Button
          className={'forward'}
          type={'primary'}
          onClick={() => forward()}>
          Forward
        </Button>
      </div>
    );

    const options: PopoverContentProps = {
      operationArea: useDefaultOperations ? defaultOperation : undefined,
      content: content
    };

    return !isMaskMoving ? (
      <Popover
        content={<PopoverContent {...options} />}
        visible={true}
        placement={getCurrentStep()?.placement}>
        {wrapper}
      </Popover>
    ) : wrapper;
  };

  return ReactDOM.createPortal(
    currentStatus === OnBoardingStatus.READY ? (
      <Mask
        visible={isShowMask}
        element={getCurrentTargetElement() || document.body}
        renderMaskContent={(wrapper) => renderPopover(wrapper)} />
    ) : null,
    document.body
  );
};

export default OnBoarding;
