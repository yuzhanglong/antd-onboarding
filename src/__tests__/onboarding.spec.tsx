import React from 'react';
import { act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createTestContainer } from '../utils/create-test-container';
import { OnBoarding, OnBoardingRef , OnBoardingStepConfig } from "..";
import zhCN from '../locale/zh-CN';

jest.useFakeTimers();

describe('引导组件相关测试', () => {
  test('测试没有配置任何步骤的场景, 组件返回一个 null', () => {
    const container = createTestContainer(
      <OnBoarding steps={[]} />
    );
    expect(container.baseElement).toMatchSnapshot();
  });

  test('测试步骤的切换能力', () => {
    const testBaseElement1 = document.createElement('div');
    testBaseElement1.style.height = '50px';
    const testBaseElement2 = document.createElement('div');
    testBaseElement2.style.height = '100px';

    const steps = [
      {
        selector: () => {
          return testBaseElement1;
        }
      },
      {
        selector: () => {
          return testBaseElement2;
        }
      }
    ];
    const container = createTestContainer(
      <OnBoarding steps={steps} />
    );

    act(() => {
      jest.advanceTimersByTime(10000);
    });


    expect(document.documentElement).toMatchSnapshot();

    act(() => {
      container.rerender(
        <OnBoarding
          step={1}
          steps={steps} />
      );
    });

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(document.documentElement).toMatchSnapshot();
  });

  test('测试 ref API', async () => {
    const testBaseElement1 = document.createElement('div');
    testBaseElement1.style.height = '50px';
    const testBaseElement2 = document.createElement('div');
    testBaseElement2.style.height = '100px';

    const ref = React.createRef<OnBoardingRef>();

    const steps: OnBoardingStepConfig[] = [
      {
        selector: () => {
          return testBaseElement1;
        },
        renderContent: () => {
          return (
            <div className={'step1'}>step 1</div>
          );
        }
      },
      {
        selector: () => {
          return testBaseElement2;
        },
        renderContent: () => {
          return (
            <div className={'step2'}>step 2</div>
          );
        }
      }
    ];
    createTestContainer(
      <OnBoarding steps={steps} ref={ref} />
    );

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(document.querySelector('.step1')).toBeTruthy();

    await act(async () => {
      await ref.current.forward();
      jest.advanceTimersByTime(10000);
    });

    expect(document.querySelector('.step2')).toBeTruthy();

    await act(async () => {
      await ref.current.back();
      jest.advanceTimersByTime(10000);
    });
    expect(document.querySelector('.step1')).toBeTruthy();
  });

  test('测试键盘事件', async () => {
    const testBaseElement1 = document.createElement('div');
    const testBaseElement2 = document.createElement('div');

    const c1 = jest.fn();
    const c2 = jest.fn();

    const steps: OnBoardingStepConfig[] = [
      {
        selector: () => {
          return testBaseElement1;
        },
        renderContent: () => {
          return (
            <div className={'step1'}>step 1</div>
          );
        },
        beforeForward: c1
      },
      {
        selector: () => {
          return testBaseElement2;
        },
        renderContent: () => {
          return (
            <div className={'step2'}>step 2</div>
          );
        },
        beforeBack: c2
      }
    ];
    createTestContainer(
      <OnBoarding steps={steps} />
    );

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(document.querySelector('.step1')).toBeTruthy();

    userEvent.keyboard('[arrowRight]');

    await act(async () => {
      jest.advanceTimersByTime(10000);
    });

    expect(c1).toBeCalledTimes(1);


    userEvent.keyboard('[arrowLeft]');

    await act(async () => {
      jest.advanceTimersByTime(10000);
    });

    expect(c2).toBeCalledTimes(1);
  });

  test('测试国际化, 默认为 en-US', () => {
    const testBaseElement1 = document.createElement('div');

    const steps = [
      {
        selector: () => {
          return testBaseElement1;
        }
      }
    ];
    const container = createTestContainer(
      <OnBoarding steps={steps} />
    );

    act(() => {
      jest.advanceTimersByTime(10000);
    });


    expect(document.documentElement.innerHTML).toContain('Got it');

    act(() => {
      container.rerender(
        <OnBoarding
          locale={zhCN}
          steps={steps} />
      );
    });

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(document.documentElement.innerHTML).toContain('我知道了');
    container.unmount();
  });

  test('测试在临界值边缘进行移动，第一步执行后退操作不处理，最后一步执行前进操作会移除组件内部 DOM', async () => {
    const testBaseElement1 = document.createElement('div');
    const ref = React.createRef<OnBoardingRef>();

    const steps: OnBoardingStepConfig[] = [
      {
        selector: () => {
          return testBaseElement1;
        },
        renderContent: () => {
          return (
            <div className={'step1'}>step 1</div>
          );
        }
      }
    ];

    createTestContainer(
      <OnBoarding steps={steps} ref={ref} />
    );

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(document.querySelector('.step1')).toBeTruthy();


    await act(async () => {
      await ref.current.back();
      jest.advanceTimersByTime(10000);
    });
    expect(document.querySelector('.step1')).toBeTruthy();

    await act(async () => {
      await ref.current.forward();
      jest.advanceTimersByTime(10000);
    });
    expect(document.querySelector('.step1')).toBeFalsy();
  });
});
