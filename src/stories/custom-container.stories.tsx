import React, { useRef, useState } from 'react';
import { Button, Drawer, Tooltip } from 'antd';
import { SearchOutlined, PoweroffOutlined } from '@ant-design/icons';
import { storiesOf } from '@storybook/react';
import { OnBoarding } from '../onboarding/onboarding';
import './style.css';
import '../../assets/index.css';
import 'antd/dist/antd.css';
import zhCN from '../locale/zh-CN';
import OnBoardingContent from './onboarding-content';
import { OnBoardingRef } from "..";


export const Basic: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const onBoardingRef = useRef<OnBoardingRef>(null);


  return (
    <div className='App'>
      <div className={'wrapper'} style={{
        height: '50vh'
      }}>
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
          getContainer={() => {
            return document.querySelector('.wrapper');
          }}
          ref={onBoardingRef}
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
                      title={'???? ???????????? antd-onboarding!'}
                      content={'?????????????????????????????????'} />
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
                      title={'???? ????????????'}
                      content={'???????????? Button ????????? Icon ?????????????????? icon ???????????????????????? Button ????????? Icon ?????????\n' +
                      '\n' +
                      '??????????????? Icon ???????????????????????????????????? Icon ??????????????? icon ?????????'} />
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
                      title={'???? ???????????????'}
                      content={'?????? loading ???????????????????????????????????????~'} />
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
    </div>
  );
};

storiesOf('OnBoarding', module).add('Custom Container', Basic);
