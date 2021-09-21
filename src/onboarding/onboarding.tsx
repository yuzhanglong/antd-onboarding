import React, { forwardRef, Fragment, useEffect, useImperativeHandle, useState } from 'react';
import ReactDOM from 'react-dom';
import { Button, Popover } from 'antd';
import { isNil, noop } from 'lodash';
import { Mask } from '../mask/mask';
import { KEYBOARD_NAMES } from '../const';
import Content, { PopoverContentProps } from './content';
import { MaskStyleChecker, OnBoardingLocale, OnBoardingRef, OnBoardingStatus, OnBoardingStepConfig } from '../types';
import enUS from '../locale/en-US';
import { useDomObserver } from '../hooks/use-dom-observer';

export interface OnBoardingProps {
  // 初始化步骤
  initialStep?: number;

  // 当前步骤
  step?: number;

  // 步骤配置
  steps: OnBoardingStepConfig[];

  // 是否展示默认操作模块(两个按钮，上一步 + 下一步)
  useDefaultOperations?: boolean;

  // 是否展示遮罩
  isShowMask?: boolean;

  // 在所有步骤结束时做些什么
  onStepsEnd?: () => void;

  // 更新 style 的 checker
  styleChecker?: MaskStyleChecker;

  // 国际化
  locale?: OnBoardingLocale;

  // 支持键盘前进后退
  supportKeyboard?: boolean;

  // 挂载节点，默认为 document.body
  getContainer?: () => HTMLElement;
}

export const OnBoarding = forwardRef<OnBoardingRef, OnBoardingProps>((props, ref) => {
  const {
    step,
    steps,
    initialStep,
    useDefaultOperations = true,
    isShowMask = false,
    onStepsEnd = noop,
    styleChecker,
    locale = enUS,
    supportKeyboard = true,
    getContainer
  } = props;

  // 当前状态
  const [currentStatus, setCurrentStatus] = useState<OnBoardingStatus>(OnBoardingStatus.NOT_READY);

  // 当前步骤(step index)
  const [currentStep, setCurrentStep] = useState<number>(initialStep || 0);

  // mask 是否在移动
  const [isMaskMoving, setIsMaskMoving] = useState<boolean>(false);

  // 当前目标 DOM 的监听
  const currentSelectedElement = useDomObserver(
    steps.length ? () => {
      return steps[currentStep]?.selector();
    } : null,
    () => {
      setCurrentStatus(OnBoardingStatus.READY);
    }, [steps, currentStep]);

  const currentContainerElement = useDomObserver(getContainer, noop, [getContainer]);

  // 获取当前步骤
  const getCurrentStep = () => {
    return steps[currentStep];
  };

  const back = async () => {
    // 如果是第一步，我们不应该往前走
    if (currentStep === 0) {
      return;
    }

    const { beforeBack = noop } = getCurrentStep();
    await beforeBack(currentStep);
    setCurrentStep(currentStep - 1);
  };

  const forward = async () => {
    // 如果是最后一步
    if (currentStep === steps.length - 1) {
      await onStepsEnd();
      setCurrentStatus(OnBoardingStatus.END);
      return;
    }

    const { beforeForward = noop } = getCurrentStep();
    await beforeForward(currentStep);
    setCurrentStep(currentStep + 1);
  };

  useEffect(() => {
    if (!isNil(step)) {
      // 不触发相关生命周期
      setCurrentStep(step);
    }
  }, [step]);

  useEffect(() => {
    const cb = async (event: KeyboardEvent) => {
      if (currentStatus === OnBoardingStatus.READY) {
        // 阻止键盘方向键导致界面滚动
        event.preventDefault();
        if (event.key === KEYBOARD_NAMES.ARROW_RIGHT) {
          await forward();
        } else if (event.key === KEYBOARD_NAMES.ARROW_LEFT) {
          await back();
        }
      }
    };

    if (supportKeyboard) {
      window.addEventListener('keydown', cb);
    }


    return () => {
      if (supportKeyboard) {
        window.removeEventListener('keydown', cb);
      }
    };
  }, [currentStatus, currentStep]);

  const renderPopover = (wrapper: React.ReactNode) => {
    const c = getCurrentStep();

    if (!c) {
      return wrapper;
    }

    const { renderContent } = c;
    const content = renderContent ? renderContent(currentStep) : null;

    const defaultOperation = (
      <div className={'onboarding-default-operation'}>
        {
          currentStep !== 0 && <Button
            className={'back'}
            onClick={() => back()}>
            {locale.previous}
          </Button>
        }
        <Button
          className={'forward'}
          type={'primary'}
          onClick={() => forward()}>
          {currentStep === steps.length - 1 ? locale.gotIt : locale.next}
        </Button>
      </div>
    );

    const options: PopoverContentProps = {
      operationArea: useDefaultOperations ? defaultOperation : undefined,
      content
    };

    return !isMaskMoving ? (
      <Popover
        content={<Content {...options} />}
        visible={true}
        placement={getCurrentStep()?.placement}>
        {wrapper}
      </Popover>
    ) : wrapper;
  };

  useImperativeHandle(
    ref,
    () => {
      return {
        forward: async () => {
          await forward();
        },
        back: async () => {
          await back();
        }
      };
    }, [step, currentStep]);

  return ReactDOM.createPortal(
    currentStatus === OnBoardingStatus.READY ? (
      <Mask
        onAnimationStart={() => {
          setIsMaskMoving(true);
        }}
        onAnimationEnd={() => {
          setIsMaskMoving(false);
        }}
        container={currentContainerElement.element}
        styleChecker={styleChecker}
        visible={isShowMask}
        element={currentSelectedElement.element || currentContainerElement.element || document.body}
        renderMaskContent={(wrapper) => renderPopover(wrapper)} />
    ) : <Fragment />,
    currentContainerElement.element || document.body
  );
});
