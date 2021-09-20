import { resizeObserverChecker } from '../utils/mask-checker/resize-observer';
import { fireEvent } from '@testing-library/react';
import { getMaskStyle } from '../';

describe('测试工具函数', () => {
  test('测试基于窗口尺寸变化的监听器', () => {
    const cb = jest.fn();
    const checker = resizeObserverChecker(null, cb);
    checker.observe();

    // see: https://github.com/testing-library/react-testing-library/issues/463
    // @ts-ignore
    // noinspection JSConstantReassignment
    window.innerWidth = 500;
    // @ts-ignore
    // noinspection JSConstantReassignment
    window.innerHeight = 500;

    // @ts-ignore
    window.requestAnimationFrame = (cb: any) => {
      cb();
      return 1;
    };

    window.cancelAnimationFrame = (timer: any) => {
      return;
    };

    fireEvent.resize(window);

    expect(cb).toBeCalledTimes(1);

    fireEvent.resize(window);
    expect(cb).toBeCalledTimes(2);


    checker.destroy();
  });

  test('测试遮罩样式计算工具', () => {
    // 为空
    expect(getMaskStyle(null, null));

    const el = document.createElement('div');

    // 我们在 jest 初始化程序中已经 hook 了 getBoundingClientRect API
    expect(getMaskStyle(el, document.documentElement)).toStrictEqual({
      'borderBottomWidth': 1000,
      'borderLeftWidth': 0,
      'borderRightWidth': 1000,
      'borderTopWidth': 0,
      'height': 1000,
      'width': 1000
    });

    el.style.height = '500px';

    expect(getMaskStyle(el, document.documentElement)).toStrictEqual({
      'borderBottomWidth': 500,
      'borderLeftWidth': 0,
      'borderRightWidth': 1000,
      'borderTopWidth': 0,
      'height': 1000,
      'width': 1000
    });
  });
});
