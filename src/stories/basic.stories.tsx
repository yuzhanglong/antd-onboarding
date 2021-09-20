import React, { useState } from 'react';
import { Card } from 'antd';
import { OnBoarding } from '../onboarding/onboarding';
import { storiesOf } from '@storybook/react';
import './style.css';
import '../../assets/index.css';
import 'antd/dist/antd.css';
import zhCN from '../locale/zh-CN';

export const Basic: React.FC = () => {
  return (
    <div className='App'>
      <div
        className='hello-1' id={'hello-1'}>
        Hello World
      </div>
      <span
        className='hello-2' id={'hello-2'}>
        又是一个 Hello World~
      </span>
      <Card
        className='hello-3'
        id={'hello-3'}>
        第三个 hello world!
      </Card>

      <iframe
        id='inlineFrameExample'
        title='Inline Frame Example'
        width='300'
        height='200'
        src='https://www.openstreetmap.org/export/embed.html?bbox=-0.004017949104309083%2C51.47612752641776%2C0.00030577182769775396%2C51.478569861898606&layer=mapnik'>
      </iframe>

      <OnBoarding
        locale={zhCN}
        isShowMask={true}
        initialStep={0}
        onStepsEnd={() => {
          console.log('end!!');
        }}
        steps={
          [
            {
              selector: () => {
                return document.getElementById('hello-1');
              },
              beforeForward: async (currentStep) => {
                console.log(`${currentStep} beforeForward!`);
              },
              beforeBack: (currentStep) => {
                console.log(`${currentStep} beforeForward!`);
              },
              renderContent: (currentStep) => {
                return (
                  <div>
                    {currentStep}
                    <div>
                      回忆就像漩涡,
                      它将我拉走. 时间的钟响起,
                      我不该逗留
                    </div>
                  </div>
                );
              },
              placement: 'bottom'
            },
            {
              selector: () => {
                return document.getElementById('hello-2');
              }
            },
            {
              selector: () => {
                return document.getElementById('hello-3');
              },
              renderContent: (currentStep) => {
                return (
                  <div>{currentStep}</div>
                );
              },
              placement: 'left'
            },
            {
              placement: 'right',
              selector: () => {
                return document.getElementById('inlineFrameExample');
              }
            }
          ]
        } />
    </div>
  );
};

storiesOf('OnBoarding', module).add('Basic Usage', Basic);