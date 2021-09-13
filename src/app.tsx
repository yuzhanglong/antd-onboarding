import React from 'react';
import OnBoarding from './onboarding';
import './style.css';

function App() {
  return (
    <div className='App'>
      <div
        className='hello-1' id={'hello-1'}>
        Hello World
      </div>
      <div
        className='hello-2' id={'hello-2'}>
        又是一个 Hello World~
      </div>
      <OnBoarding steps={
        [
          {
            selector: () => {
              return document.getElementById('hello-1');
            },
            placement: 'right'
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
