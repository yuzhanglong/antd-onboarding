import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { noop } from 'lodash';
import { MASK_ANIMATION_TIME } from '../const';
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

  // 当动画开始时做些什么
  // 在 mask 的基准元素切换时，会有一个过渡动画，我们有必要在过渡动画进行的时候隐藏外面的 tooltip
  // 以免引起不好的视觉效果
  onAnimationStart?: () => void;

  // 当动画结束时做些什么
  onAnimationEnd?: () => void;
}

export const Mask: React.FC<MaskProps> = (props) => {
  const {
    element,
    renderMaskContent,
    visible = true,
    styleChecker,
    onAnimationEnd = noop,
    onAnimationStart = noop,
    container
  } = props;

  const [style, setStyle] = useState<Record<string, any>>({});

  const checkStyle = () => {
    element.scrollIntoView({
      block: 'nearest'
    });

    const style = getMaskStyle(element, container || document.documentElement);
    setStyle(style);
  };

  useEffect(() => {
    if (!element) {
      return;
    }

    checkStyle();
  }, [element, container]);

  useEffect(() => {
    if (!element) {
      return;
    }
    const observer: MaskStyleChecker = styleChecker || resizeObserverChecker;
    const o = observer(element, checkStyle);
    o.observe();

    return () => {
      o.destroy();
    };
  }, [element, container]);

  useEffect(() => {
    onAnimationStart();
    let t = null;
    t = setTimeout(() => {
      onAnimationEnd();
    }, MASK_ANIMATION_TIME);

    return () => {
      window.clearTimeout(t);
    };
  }, [element]);

  const maskClasses = classNames(
    'mask',
    'mask-animation',
    !visible && 'mask-not-visible'
  );

  const getContent = () => {
    if (!renderMaskContent) {
      return null;
    }
    return renderMaskContent(
      <div className={'mask-content'} style={{ width: '100%', height: '100%' }} />
    );
  };

  return (
    <div
      style={style}
      className={maskClasses}>
      {getContent()}
    </div>
  );
};
