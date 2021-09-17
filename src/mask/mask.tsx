import React, { useEffect, useState } from 'react';
import { MASK_ANIMATION_TIME } from '../const';
import classNames from 'classnames';
import { getMaskStyle } from '../utils/get-mask-style';
import { resizeObserverChecker } from '../utils/mask-checker/resize-observer';
import { MaskStyleChecker } from '../types';

interface MaskProps {
  // 基准元素
  element: HTMLElement;

  // mask 所在的容器，如果没有配置则为 document
  container?: HTMLElement;

  // mask 内部内容，可以把 popover 之类的东西渲染到这个上面
  renderMaskContent?: (wrapper: React.ReactNode) => React.ReactNode;

  // mask 是否可见，如果这个值为 false，那么它是透明的，底部的内容也是可操作的
  visible?: boolean;

  // 更新样式的检测器，如果没有则默认监听 resize, 例如用户在改变窗口大小时就可以做到实时改变
  styleChecker?: MaskStyleChecker;
}

export const Mask: React.FC<MaskProps> = (props) => {
  const { element, renderMaskContent, visible = true, styleChecker } = props;
  const [style, setStyle] = useState<Record<string, any>>({});
  const [isAnimationMaskAllowed, setIsAnimationMaskAllowed] = useState<boolean>(false);

  const checkStyle = () => {
    element.scrollIntoView({
      block: 'nearest'
    });

    const style = getMaskStyle(element, document.documentElement);
    setStyle(style);
  };

  useEffect(() => {
    checkStyle();
  }, [element]);

  useEffect(() => {
    const observer: MaskStyleChecker = styleChecker || resizeObserverChecker;
    const o = observer(element, checkStyle);
    o.observe();

    return () => {
      o.destroy();
    };
  }, [element]);

  useEffect(() => {
    setTimeout(() => {
      setIsAnimationMaskAllowed(true);
    }, MASK_ANIMATION_TIME);
  }, [element]);

  const maskClasses = classNames(
    'mask',
    isAnimationMaskAllowed && 'mask-animation',
    !visible && 'mask-not-visible'
  );

  return (
    <div
      style={style}
      className={maskClasses}>
      {
        renderMaskContent && renderMaskContent(
          <div className={'mask-content'} style={{ width: '100%', height: '100%' }} />
        )
      }
    </div>
  );
};
