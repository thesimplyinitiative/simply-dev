import { base } from './common/base';
import react from 'eslint-plugin-react';
import reactRecommended from 'eslint-plugin-react/configs/recommended';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from './common/globals';
import { PATHS } from '../utils/paths';
import { createConfig, defineRules, withPath } from '../utils';

const sourceConfig = withPath(PATHS.SOURCE.FILE);

const plugins = sourceConfig.definePlugins({
  plugins: {
    react,
    'react-hooks': reactHooks,
  },
});

const settings = sourceConfig.defineSettings({
  languageOptions: {
    ...globals.browser.languageOptions,
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
});

const reactRules = defineRules({
  'react/prop-types': 0,
});

const checkFileRules = defineRules({
  'check-file/folder-match-with-fex': [
    'error',
    {
      '(actions|state).{js,jsx,ts,tsx}': '**/store',
    },
  ],
});

const pluginRules = sourceConfig
  .rules()
  .add(reactRules)
  .add(checkFileRules)
  .toFlatConfig();

const overrides = sourceConfig.defineOverrides(
  {
    ...reactRecommended,
  },
  {
    ...reactHooks['config']['recommended'],
  }
);

const pageRules = withPath(PATHS.ARCHITECTURE.PAGES)
  .rules()
  .add(
    defineRules({
      'import/no-default-export': 0,
      'import/no-named-export': 2,
    })
  )
  .toFlatConfig();

const pageAndFeatureRules = withPath([
  PATHS.ARCHITECTURE.PAGES,
  PATHS.ARCHITECTURE.FEATURES,
])
  .rules()
  .add(
    defineRules({
      'check-file/no-index': 'error',
    })
  )
  .toFlatConfig();

export const frontend = createConfig(
  ...base,
  plugins,
  settings,
  pluginRules,
  ...overrides,
  pageRules,
  pageAndFeatureRules
);
