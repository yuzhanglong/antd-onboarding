import { TooltipPlacement } from 'antd/es/tooltip';
import React from 'react';

export enum OnBoardingStatus {
  // 未开始，例如暂未查找到步骤的节点
  NOT_READY,

  // 已经准备好
  READY,

  // 流程结束
  END
}

export interface OnBoardingStepConfig {
  // 选择的元素
  selector: () => HTMLElement | null;

  // tooltip 的位置
  placement?: TooltipPlacement;

  // 内容
  renderContent?: (currentStep: number) => React.ReactNode;

  // 在下一步之前做些什么
  beforeForward?: (currentStep: number) => void;

  // 在上一步之前做些什么
  beforeBack?: (currentStep: number) => void;
}

export interface OnBoardingLocale {
  locale: string;
  // 上一步
  previous: string;
  // 下一步
  next: string;
  // 我知道了
  gotIt: string;
}

export interface OnMaskStyleCheckObserverResponse {
  observe: () => void,
  destroy: () => void
}


export type MaskStyleChecker = (element: HTMLElement, check: () => void) => OnMaskStyleCheckObserverResponse

export interface OnBoardingRef {
  forward: () => void;
  back: () => void;
}
