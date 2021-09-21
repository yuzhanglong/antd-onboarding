import { ReactElement } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { act, render, RenderResult } from '@testing-library/react';

export const createTestContainer = (cmp: ReactElement) => {
  const el = document.createElement('div');
  document.body.appendChild(el);

  let container: RenderResult = null;
  act(() => {
    container = render(cmp, {
      container: el
    });
  });

  return container;
};
