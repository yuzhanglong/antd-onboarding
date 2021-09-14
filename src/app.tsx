import React from 'react';
import OnBoarding from './onboarding/onboarding';
import './style.scss';
import { Card } from 'antd';

const App: React.FC = () => {
  return (
    <div className='App'>
      <div
        className='hello-1' id={'hello-1'}>
        Hello World
      </div>
      <Card
        className='hello-2' id={'hello-2'}>
        又是一个 Hello World~
      </Card>
      <iframe
        id='inlineFrameExample'
        title='Inline Frame Example'
        width='300'
        height='200'
        src='https://www.openstreetmap.org/export/embed.html?bbox=-0.004017949104309083%2C51.47612752641776%2C0.00030577182769775396%2C51.478569861898606&layer=mapnik'>
      </iframe>

      <OnBoarding
        initialStep={2}
        steps={
          [
            {
              selector: () => {
                return document.getElementById('hello-1');
              },
              renderContent: (currentStep) => {
                return (
                  <div>{currentStep}</div>
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

export default App;
