import { Config } from '@jest/types';

const config: Config.InitialOptions = {
  testEnvironment: 'jsdom',
  preset: 'ts-jest',
  testRegex: ['(/__tests__/.*\\.(test|spec))\\.[jt]sx?$'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}'
  ],
  coveragePathIgnorePatterns: [
    '.stories.tsx',
    './src/utils/mask-checker/animation-frame.ts'
  ],
  setupFiles: [
    './src/__tests__/setup.ts'
  ]
};

export default config;
