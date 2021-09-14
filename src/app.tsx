import React from 'react';
import OnBoarding from './onboarding';
import './style.css';
import { Card } from 'antd';

function App() {
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
      <OnBoarding steps={
        [
          {
            selector: () => {
              return document.getElementById('hello-1');
            },
            placement: 'bottom'
          },
          {
            placement: 'right',
            selector: () => {
              return document.getElementById('hello-2');
            }
          }
        ]
      } />
    </div>
  );
}

export default App;
