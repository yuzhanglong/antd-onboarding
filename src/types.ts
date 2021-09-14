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
  // mask 的容器
  container?: () => HTMLElement | null;
  // tooltip 的位置
  placement?: TooltipPlacement;
  // 内容
  renderContent?: (currentStep: number) => React.ReactNode;
}
