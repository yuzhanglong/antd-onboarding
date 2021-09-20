import React, { useRef, useState } from 'react';
import { Button, Drawer, Dropdown, Menu, Tooltip } from 'antd';
import { SearchOutlined, PoweroffOutlined, DownOutlined } from '@ant-design/icons';
import { OnBoarding } from '../onboarding/onboarding';
import { storiesOf } from '@storybook/react';
import './style.css';
import '../../assets/index.css';
import 'antd/dist/antd.css';
import zhCN from '../locale/zh-CN';
import OnBoardingContent from './onboarding-content';
import { OnBoardingRef } from '../';


export const Basic: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const onboardingRef = useRef<OnBoardingRef>(null);

  setTimeout(() => {
    onboardingRef.current.forward();
  }, 1000);
  setTimeout(() => {
    onboardingRef.current.forward();
  }, 2000);
  setTimeout(() => {
    onboardingRef.current.forward();
  }, 3000);
  setTimeout(() => {
    onboardingRef.current.back();
  }, 4000);
  setTimeout(() => {
    onboardingRef.current.back();
  }, 5000);

  return (
    <div className='App'>
      <div id={'button-group'} style={{
        display: 'inline-block',
        marginTop: 20
      }}>
        <Button type='primary'>Primary Button</Button>
        <Button>Default Button</Button>
        <Button type='dashed'>Dashed Button</Button>
        <br />
        <Button type='text'>Text Button</Button>
        <Button type='link'>Link Button</Button>
      </div>

      <br />

      <div
        id={'button-group2'}
        style={{
          marginTop: 20,
          display: 'inline-block'
        }}>
        <Tooltip title='search'>
          <Button type='primary' shape='circle' icon={<SearchOutlined />} />
        </Tooltip>
        <Button type='primary' shape='circle'>
          A
        </Button>
        <Button type='primary' icon={<SearchOutlined />}>
          Search
        </Button>
        <Tooltip title='search'>
          <Button shape='circle' icon={<SearchOutlined />} />
        </Tooltip>
      </div>

      <br />

      <div
        id={'button-group3'}
        style={{
          marginTop: 20,
          display: 'inline-block'
        }}>
        <>
          <Button type='primary' loading>
            Loading
          </Button>
          <Button type='primary' size='small' loading>
            Loading
          </Button>
          <Button type='primary' icon={<PoweroffOutlined />} loading />
        </>
      </div>

      <br />

      <div
        style={{
          marginTop: 20,
          display: 'inline-block'
        }}>
        <Drawer
          mask={false}
          className={'button-group4'}
          title='Basic Drawer'
          placement={'bottom'}
          closable={false}
          visible={isDropdownOpen}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Drawer>
      </div>

      <OnBoarding
        useDefaultOperations={false}
        ref={onboardingRef}
        locale={zhCN}
        isShowMask={true}
        initialStep={0}
        steps={
          [
            {
              selector: () => {
                return document.getElementById('button-group');
              },
              renderContent: () => {
                return (
                  <OnBoardingContent
                    title={'🎉 欢迎使用 antd-onboarding!'}
                    content={'按钮有五种类型：主按钮、次按钮、虚线按钮、文本按钮和链接按钮。主按钮在同一个操作区域最多出现一次。'} />
                );
              },
              placement: 'bottom'
            },
            {
              selector: () => {
                return document.getElementById('button-group2');
              },
              renderContent: () => {
                return (
                  <OnBoardingContent
                    title={'😆 图标按钮'}
                    content={'当需要在 Button 内嵌入 Icon 时，可以设置 icon 属性，或者直接在 Button 内使用 Icon 组件。\n' +
                    '\n' +
                    '如果想控制 Icon 具体的位置，只能直接使用 Icon 组件，而非 icon 属性。'} />
                );
              }
            },
            {
              selector: () => {
                return document.getElementById('button-group3');
              },
              renderContent: () => {
                return (
                  <OnBoardingContent
                    title={'😊 加载中状态'}
                    content={'添加 loading 属性即可让按钮处于加载状态~'} />
                );
              },
              beforeForward: async () => {
                setIsDropdownOpen(true);
                await new Promise(resolve => setTimeout(resolve, 1000));
              }
            }
          ]
        } />
    </div>
  );
};

storiesOf('OnBoarding', module).add('Ref API', Basic);
