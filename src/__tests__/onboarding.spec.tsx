import { createTestContainer } from '../utils/create-test-container';
import React from 'react';
import { OnBoarding, OnBoardingRef } from '../onboarding/onboarding';
import { act } from '@testing-library/react';
import { OnBoardingStepConfig } from '../types';

describe('引导组件相关测试', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    // 退出时进行清理
    jest.useRealTimers();
  });


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
    container.unmount();
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
});
