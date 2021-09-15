import React, { useEffect, useRef, useState } from 'react';
import { MASK_ANIMATION_TIME } from '../const';
import classNames from 'classnames';
import { getMaskStyle } from '../utils/get-mask-style';

interface MaskProps {
  // 基准元素
  element: HTMLElement;

  // mask 所在的容器，如果没有配置则为 document
  container?: HTMLElement;

  // mask 内部内容，可以把 popover 之类的东西渲染到这个上面
  renderMaskContent?: (wrapper: React.ReactNode) => React.ReactNode;

  // mask 是否可见，如果这个值为 false，那么它是透明的，底部的内容也是可操作的
  visible?: boolean;
}

export const Mask: React.FC<MaskProps> = (props) => {
  const { element, renderMaskContent, visible = true } = props;
  const [style, setStyle] = useState<Record<string, any>>({});
  const [isAnimationMaskAllowed, setIsAnimationMaskAllowed] = useState<boolean>(false);

  const timerRef = useRef<number | null>(null);

  const onWindowResize = () => {
    if (timerRef.current) {
      window.cancelAnimationFrame(timerRef.current);
    }

    timerRef.current = window.requestAnimationFrame(() => {
      checkStyle();
    });
  };

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
    const cb = () => {
      onWindowResize();
    };
    window.addEventListener('resize', cb);

    return () => {
      window.removeEventListener('resize', cb);
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
