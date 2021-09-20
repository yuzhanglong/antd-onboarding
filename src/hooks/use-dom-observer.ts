import { useEffect, useState } from 'react';
import { isFunction } from 'lodash';

export const useDomObserver = (
  getter: () => HTMLElement,
  onGet?: (element: HTMLElement) => void,
  deps?: any[]
) => {
  const [element, setElement] = useState<HTMLElement>(null);

  // 用于渲染
  const [renderTick, setRenderTick] = useState<number>(0);

  useEffect(() => {
    if (!isFunction(getter)) {
      return;
    }

    const el = getter();
    if (!el) {
      setRenderTick(renderTick + 1);
    } else {
      setElement(el);
      onGet(element);
    }
  }, [renderTick, ...deps]);

  return {
    element
  };
};
