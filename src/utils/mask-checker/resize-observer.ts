import { MaskStyleChecker } from '../../types';

export const resizeObserverChecker: MaskStyleChecker = (element, check) => {
  let timer = null;

  const onWindowResize = () => {
    if (timer) {
      window.cancelAnimationFrame(timer);
    }

    timer = window.requestAnimationFrame(() => {
      check();
    });
  };


  return {
    observe: () => {
      window.addEventListener('resize', onWindowResize);
    },
    destroy: () => {
      window.removeEventListener('resize', onWindowResize);
    }
  };
};
