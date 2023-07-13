import { FlatESLintConfig } from 'eslint-define-config';
import * as globals from 'globals';

const node: FlatESLintConfig = {
  languageOptions: {
    globals: {
      ...globals.node,
    },
  },
};

const browser: FlatESLintConfig = {
  languageOptions: {
    globals: {
      ...globals.browser,
    },
  },
};

const jest: FlatESLintConfig = {
  languageOptions: {
    globals: {
      ...node.languageOptions?.globals,
      ...globals.jest,
    },
  },
};

export default {
  node,
  browser,
  jest,
};
