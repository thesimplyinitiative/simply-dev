import { FlatESLintConfig } from 'eslint-define-config';
import globs from 'globals';

const node: FlatESLintConfig = {
  languageOptions: {
    globals: {
      ...globs.node,
    },
  },
};

const browser: FlatESLintConfig = {
  languageOptions: {
    globals: {
      ...globs.browser,
    },
  },
};

const jest: FlatESLintConfig = {
  languageOptions: {
    globals: {
      ...node.languageOptions!.globals,
      ...globs.jest,
    },
  },
};

export const globals = {
  node,
  browser,
  jest,
} as const;
