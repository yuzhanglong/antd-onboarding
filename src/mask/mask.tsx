import React, { useEffect, useRef, useState } from 'react';
import { MASK_ANIMATION_TIME } from '../const';
import './mask.scss';
import classNames from 'classnames';

interface MaskProps {
  element: HTMLElement;
  renderMaskContent?: (wrapper: React.ReactNode) => React.ReactNode;
  // mask 是否可见，如果这个值为 false，那么它是透明的，底部的内容也是可操作的
  visible?: boolean;
}

const getMaskStyle = (element: HTMLElement) => {
  if (!element) {
    return {};
  }

  const container = window.document.documentElement;
  const { scrollWidth, scrollHeight, scrollTop } = container;
  const anchorPos = element.getBoundingClientRect();
  const { height, width, left } = anchorPos;

  const top = anchorPos.top + scrollTop;

  return {
    width: scrollWidth,
    height: scrollHeight,
    borderTopWidth: Math.max(top, 0),
    borderBottomWidth: Math.max(scrollHeight - height - top, 0),
    borderRightWidth: Math.max(scrollWidth - width - left, 0),
    borderLeftWidth: Math.max(left, 0)
  };
};

const Mask: React.FC<MaskProps> = (props) => {
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
    const style = getMaskStyle(element);
    setStyle(style);
  };

  useEffect(() => {
    checkStyle();
  }, [element]);

  useEffect(() => {
    window.addEventListener('resize', () => {
      onWindowResize();
    });
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

export default Mask;
