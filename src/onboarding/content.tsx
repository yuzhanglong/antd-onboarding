import React from 'react';

export interface PopoverContentProps {
  // 底部操作区域
  operationArea?: React.ReactNode;
  // 内容
  content: React.ReactNode;
}

const Content: React.FC<PopoverContentProps> = (props) => {
  return (
    <div className={'onboarding-popover-wrapper'}>
      <div className={'onboarding-popover-content'}>
        {props.content}
      </div>
      {
        props.operationArea
        && <div className={'onboarding-popover-operation-area'}>
          {props.operationArea}
        </div>
      }
    </div>
  );
};

export default Content;
