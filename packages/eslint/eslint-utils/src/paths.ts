const UNIT_TEST = {
  ANY_FILE: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  FILE: '*.test.{js,jsx,ts,tsx}',
  FOLDER: '**/__tests__/',
  BLACKLISTED: 'test.[jt]s?(x)',
} as const;

const SOURCE = {
  ANY: '**/*',
  FILE: './src/**/*.[jt]s?(x)',
  FOLDER: './src/**',
  TS_FILES: './src/**/*.ts?(x)',
  JS_FILES: './src/**/*.js?(x)',
} as const;

const ARCHITECTURE = {
  PAGES: './src/pages/**',
  FEATURES: './src/features/**',
} as const;

export const PATHS = {
  UNIT_TEST,
  SOURCE,
  ARCHITECTURE,
} as const;
