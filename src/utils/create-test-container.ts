import { ReactElement } from 'react';
import { act, create, ReactTestRenderer } from 'react-test-renderer';

export const createTestContainer = (cmp: ReactElement) => {
  let container: ReactTestRenderer = null;
  act(() => {
    container = create(cmp);
  });

  return container;
};
