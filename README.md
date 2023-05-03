<h1 align="center">
<b>antd-onboarding</b>
</h1>

<div align="center">
<div>
基于 Ant Design 的新手引导组件
</div>
<br/>

<div>

[![CI](https://github.com/yuzhanglong/antd-onboarding/actions/workflows/main.yml/badge.svg?branch=master)](https://github.com/yuzhanglong/antd-onboarding/actions/workflows/main.yml)
[![codecov](https://codecov.io/gh/yuzhanglong/antd-onboarding/branch/master/graph/badge.svg?token=OciNkZGJan)](https://codecov.io/gh/yuzhanglong/antd-onboarding)
[![npm Version](https://img.shields.io/npm/v/antd-onboarding.svg)](https://www.npmjs.com/package/antd-onboarding)
[![npm License](https://img.shields.io/npm/l/antd-onboarding.svg)](https://www.npmjs.com/package/antd-onboarding)
</div>

![screenshot](https://github.com/yuzhanglong/yuzhanglong/blob/master/onboarding-demo.gif?raw=true)
</div>

## Installation

```shell
yarn add antd-onboarding

# or
pnpm i antd-onboarding
```

## Getting Started

**基本使用**

```tsx
import React from 'react';
import { OnBoarding } from 'antd-onboarding';
import 'antd-onboarding/assets/index.css';
import 'antd/dist/antd.css';


export const Basic: React.FC = () => {
  return (
    <div className='App'>
      <div id={'name'} style={{ marginBottom: 25 }}>Jim</div>
      <div id={'age'}>20</div>

      <OnBoarding
        isShowMask={true}
        steps={
          [
            {
              selector: () => {
                return document.getElementById('name');
              },
              renderContent: () => {
                return (
                  <div>This is my name!</div>
                );
              }
            },
            {
              selector: () => {
                return document.getElementById('age');
              },
              renderContent: () => {
                return (
                  <div>This is my age!</div>
                );
              }
            }
          ]
        } />
    </div>
  );
};
```

**使用 ref API**

```tsx
import React from 'react';
import { OnBoarding } from 'antd-onboarding';
import 'antd-onboarding/assets/index.css';
import 'antd/dist/antd.css';

export const Basic: React.FC = () => {
  const onboardingRef = useRef<OnBoardingRef>(null);

  setTimeout(() => {
    // 一秒后前进一步
    onboardingRef.current?.forward();
  }, 1000);
  setTimeout(() => {
    // 两秒后后退一步
    onboardingRef.current?.back();
  }, 2000);

  return (
    <div className='App'>
      <div id={'name'} style={{ marginBottom: 25 }}>Jim</div>
      <div id={'age'}>20</div>

      <OnBoarding
        ref={onboardingRef}
        isShowMask={true}
        steps={
          [
            {
              selector: () => {
                return document.getElementById('name');
              },
              renderContent: () => {
                return (
                  <div>This is my name!</div>
                );
              }
            },
            {
              selector: () => {
                return document.getElementById('age');
              },
              renderContent: () => {
                return (
                  <div>This is my age!</div>
                );
              }
            }
          ]
        } />
    </div>
  );
};
```

**国际化**

```tsx
import React from 'react';
import { OnBoarding } from 'antd-onboarding';
import 'antd-onboarding/assets/index.css';
import 'antd/dist/antd.css';
import zhCN from 'antd-onboarding/esm/locale/zh-CN';

export const Basic: React.FC = () => {
  const onboardingRef = useRef<OnBoardingRef>(null);

  setTimeout(() => {
    // 一秒后前进一步
    onboardingRef.current?.forward();
  }, 1000);
  setTimeout(() => {
    // 两秒后后退一步
    onboardingRef.current?.back();
  }, 2000);

  return (
    <div className='App'>
      <div id={'name'} style={{ marginBottom: 25 }}>Jim</div>
      <div id={'age'}>20</div>

      <OnBoarding
        locale={zhCN}
        ref={onboardingRef}
        isShowMask={true}
        steps={[/* add your steps */]} />
    </div>
  );
};
```

## API

**OnBoarding**

| 属性 | 说明 | 类型 | 默认值 | 
| --- | --- | --- | --- | 
| initialStep | 初始化的步骤序号 | 0 | false | 
| step | 当前步骤 | number | undefined |  
| steps | 步骤配置 | OnBoardingStepConfig[] (见下文) | [] |  
| useDefaultOperations | 是否使用默认的操作组件，它包含一个下一步按钮和一个上一步按钮，支持国际化 | boolean | true |  
| isShowMask | 是否展示阴影遮罩层 | boolean | false |  
| onStepsEnd | 在所有步骤结束时做些什么 | () => void | - |  
| styleChecker | 配置遮罩层刷新监听器的回调函数，默认监听全局的 resize 方法 | MaskStyleChecker | - |  
| locale | 国际化配置 | object | en-us |  | 
| supportKeyboard | 是否支持键盘前进后退键模拟点击下一步与上一步 | boolean | true
| getContainer | 配置组件容器 | HTMLElement | document.documentElement  | 

**OnBoardingStepConfig**

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | 
| selector | 需要选择的元素 | () => HTMLElement | - |  
| placement | tooltip 的位置 | string | bottom |
| renderContent | tooltip 中的内容 | (currentStep: number) => React.ReactNode | - |
| beforeForward | 在下一步之前做些什么 | (currentStep: number) => void | - |
| beforeBack | 在上一步之前做些什么 |(currentStep: number) => void  | - |

**OnBoardingRef**

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | 
| forward | 前进一步 | () => void | - |  
| back | 后退一步 | () => void | - |

## License

MIT@[yuzhanglong](https://github.com/yuzhanglong).
