import React from 'react';
import { OnBoarding } from '../onboarding/onboarding';
import { storiesOf } from '@storybook/react';
import './style.css';
import '../../assets/index.css';
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
              },
              placement: 'bottom'
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

storiesOf('OnBoarding', module).add('Hello World', Basic);
