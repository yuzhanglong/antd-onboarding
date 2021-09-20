import React from 'react';
import { Mask } from '../';
import { noop } from 'lodash';
import { createTestContainer } from '../utils/create-test-container';
import { MASK_ANIMATION_TIME } from '../';
import { act } from '@testing-library/react';

jest.useFakeTimers();

describe('引导组件遮罩层相关测试', () => {
  const testBaseElement = document.createElement('div');
  testBaseElement.style.height = '200px';
  testBaseElement.style.width = '200px';
  document.body.appendChild(testBaseElement);

  test('mask 配置的监听器应该按预期销毁', () => {
    const destroyCallback = jest.fn();
    const container = createTestContainer(
      <Mask
        styleChecker={
          () => {
            return {
              observe: noop,
              destroy: destroyCallback
            };
          }
        }
        element={testBaseElement} />
    );

    // 未销毁
    expect(destroyCallback).toBeCalledTimes(0);

    act(() => {
      container.unmount();
    });

    expect(destroyCallback).toBeCalledTimes(1);
  });

  test('基准元素为空, mask 不会去计算样式或者监听基准元素, 仅渲染一个无样式的空 div', () => {
    const checkCallback = jest.fn();
    const Wrapper = () => {
      return (
        <Mask element={null} styleChecker={() => {
          return {
            observe: checkCallback,
            destroy: noop
          };
        }} />
      );
    };

    const container = createTestContainer(<Wrapper />);


    expect(checkCallback).toBeCalledTimes(0);
    expect(container.baseElement).toMatchSnapshot();
  });

  test('配置了基准元素, mask 样式应该被计算后写入 dom', async () => {
    const container = createTestContainer(<Mask element={testBaseElement} />);
    expect(container.baseElement).toMatchSnapshot();
  });

  test('测试遮罩层可见能力, 默认为 true', () => {
    const container = createTestContainer(
      <Mask
        element={testBaseElement}
        visible={false} />
    );


    expect(container.baseElement).toMatchSnapshot();

    act(() => {
      container.rerender(
        <Mask
          element={testBaseElement}
          visible={true} />
      );
    });

    expect(container.baseElement).toMatchSnapshot();
  });

  test('测试 mask 的两个生命周期 onAnimationStart / onAnimationEnd', () => {
    const animationStartCallback = jest.fn();
    const animationEndCallback = jest.fn();
    const container = createTestContainer(
      <Mask
        onAnimationStart={animationStartCallback}
        onAnimationEnd={animationEndCallback}
        element={testBaseElement} />
    );

    expect(animationStartCallback).toBeCalledTimes(1);
    expect(animationEndCallback).toBeCalledTimes(0);

    // 在动画结束的时间后组件应该调用 animationEndCallback
    jest.advanceTimersByTime(MASK_ANIMATION_TIME);
    expect(animationStartCallback).toBeCalledTimes(1);
    expect(animationEndCallback).toBeCalledTimes(1);


    // 在 element 更新后重复上述生命周期
    const el2 = document.createElement('div');
    act(() => {
      container.rerender(
        <Mask
          onAnimationStart={animationStartCallback}
          onAnimationEnd={animationEndCallback}
          element={el2} />
      );
    });

    expect(animationStartCallback).toBeCalledTimes(2);
    expect(animationEndCallback).toBeCalledTimes(1);
    jest.advanceTimersByTime(MASK_ANIMATION_TIME);
    expect(animationStartCallback).toBeCalledTimes(2);
    expect(animationEndCallback).toBeCalledTimes(2);
  });

  test('测试 mask 子组件的写入', () => {
    const container = createTestContainer(
      <Mask
        element={testBaseElement}
        renderMaskContent={(wrapper) => {
          return (
            <div>
              {wrapper}
              hello world!
            </div>
          );
        }} />
    );
    expect(container.baseElement).toMatchSnapshot();
  });
});
