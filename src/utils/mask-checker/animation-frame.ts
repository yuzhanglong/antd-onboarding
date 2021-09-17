import { MaskStyleChecker } from '../../types';

export const animationFrameChecker: MaskStyleChecker = (element, check) => {
  let timer = null;

  const checkCallback = () => {
    if (timer) {
      window.cancelAnimationFrame(timer);
    }

    timer = window.requestAnimationFrame(() => {
      check();
      checkCallback();
    });
  };


  return {
    observe: () => {
      timer = window.requestAnimationFrame(checkCallback);
    },
    destroy: () => {
      if (timer) {
        window.cancelAnimationFrame(timer);
      }
    }
  };
};
