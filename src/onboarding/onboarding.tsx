import React, { useCallback, useEffect, useState } from 'react';
import { Mask } from '../mask/mask';
import ReactDOM from 'react-dom';
import { Button, Popover } from 'antd';
import { MASK_ANIMATION_TIME } from '../const';
import Content, { PopoverContentProps } from './content';
import { MaskStyleCheckObserver, OnBoardingStatus, OnBoardingStepConfig } from '../types';
import { noop } from 'lodash';

interface OnBoardingProps {
  // 初始化步骤
  initialStep?: number;

  // 步骤配置
  steps: OnBoardingStepConfig[];

  // 是否展示默认操作模块(两个按钮，上一步 + 下一步)
  useDefaultOperations?: boolean;

  // 是否展示遮罩
  isShowMask?: boolean;

  // 在所有步骤结束时做些什么
  onStepsEnd?: () => void;

  // 更新 style 的 checker
  styleCheckObserver?: MaskStyleCheckObserver;
}

export const OnBoarding: React.FC<OnBoardingProps> = (props) => {
  const {
    steps,
    initialStep,
    useDefaultOperations = true,
    isShowMask = false,
    onStepsEnd = noop,
    styleCheckObserver
  } = props;

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
    return steps[currentStep];
  };

  // 重置 mask 状态
  const setMaskNotMoving = () => {
    setTimeout(() => {
      setIsMaskMoving(false);
    }, MASK_ANIMATION_TIME);
  };

  const initCurrentSelectedElement = () => {
    const currentElement = getCurrentTargetElement();

    if (!currentElement) {
      setRenderTick(renderTick + 1);
    } else {
      setCurrentStatus(OnBoardingStatus.READY);
    }
  };

  const back = async () => {
    // 如果是第一步，我们不应该往前走
    if (currentStep === 0) {
      return;
    }
    setIsMaskMoving(true);

    const { beforeBack = noop } = getCurrentStep();
    await beforeBack(currentStep);
    setCurrentStep(currentStep - 1);

    setMaskNotMoving();
  };

  const forward = async () => {
    // 如果是最后一步
    if (currentStep === steps.length - 1) {
      await onStepsEnd();
      setCurrentStatus(OnBoardingStatus.END);
      return;
    }

    setIsMaskMoving(true);

    const { beforeForward = noop } = getCurrentStep();
    await beforeForward(currentStep);
    setCurrentStep(currentStep + 1);

    setMaskNotMoving();
  };

  const renderPopover = (wrapper: React.ReactNode) => {
    const c = getCurrentStep();

    if (!c) {
      return wrapper;
    }

    const { renderContent } = c;
    const content = renderContent ? renderContent(currentStep) : null;

    const defaultOperation = (
      <div className={'onboarding-default-operation'}>
        <Button
          className={'back'}
          onClick={() => back()}>
          上一步
        </Button>
        <Button
          className={'forward'}
          type={'primary'}
          onClick={() => forward()}>
          下一步
        </Button>
      </div>
    );

    const options: PopoverContentProps = {
      operationArea: useDefaultOperations ? defaultOperation : undefined,
      content: content
    };

    return !isMaskMoving ? (
      <Popover
        content={<Content {...options} />}
        visible={!isMaskMoving}
        placement={getCurrentStep()?.placement}>
        {wrapper}
      </Popover>
    ) : wrapper;
  };

  return ReactDOM.createPortal(
    currentStatus === OnBoardingStatus.READY ? (
      <Mask
        styleCheckObserver={styleCheckObserver}
        visible={isShowMask}
        element={getCurrentTargetElement() || document.body}
        renderMaskContent={(wrapper) => renderPopover(wrapper)} />
    ) : null,
    document.body
  );
};
