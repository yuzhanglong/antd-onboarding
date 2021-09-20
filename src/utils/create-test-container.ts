import { ReactElement } from 'react';
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
