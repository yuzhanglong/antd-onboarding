import React, { useState } from 'react';
import { Card } from 'antd';
import { OnBoarding } from '../onboarding/onboarding';
import { storiesOf } from '@storybook/react';
import './style.css';
import '../../assets/index.css';
import 'antd/dist/antd.css';
import { locale } from '../locale/zh-CN';

export const OnBoardingPreview: React.FC = () => {
  const [helloContentVisible, setHelloContentVisible] = useState<boolean>(false);

  return (
    <div className='App'>
      <div
        className='hello-1' id={'hello-1'}>
        Hello World
      </div>
      <span
        className='hello-2' id={'hello-2'}>
        又是一个 Hello World~
        {helloContentVisible && <span>hellhellohellohellohellohellohellohellohellohellohellohellohellohello</span>}
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
        locale={locale}
        styleCheckObserver={(element, check) => {
          let timer = null;

          const onWindowResize = () => {
            if (timer) {
              window.cancelAnimationFrame(timer);
            }

            timer = window.requestAnimationFrame(() => {
              console.log('check!');
              check();
            });
          };

          const m = new MutationObserver((m) => {
            console.log(m);
          });

          m.observe(element, {
            childList: true,
            subtree: true,
            attributes: true
          });


          return {
            observe: () => {
              window.addEventListener('resize', onWindowResize);

            },
            destroy: () => {
              window.removeEventListener('resize', onWindowResize);
              m.disconnect();
            }
          };
        }}
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
                setTimeout(() => {
                  setHelloContentVisible(true);
                }, 1000);
                // await new Promise((resolve) => {
                //   setTimeout(() => {
                //
                //     resolve(true);
                //   }, 1000);
                // });
              },
              beforeBack: (currentStep) => {
                console.log(`${currentStep} beforeForward!`);
              },
              renderContent: () => {
                return (
                  <div>
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

storiesOf('OnBoarding', module).add('OnBoarding', OnBoardingPreview);
