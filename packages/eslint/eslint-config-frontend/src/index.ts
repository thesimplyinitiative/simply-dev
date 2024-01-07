import { extendBaseConfig } from '@simply-dev/eslint-config-base';
//@ts-expect-error no type declarations
import reactRecommended from 'eslint-plugin-react/configs/recommended.js';
//@ts-expect-error no type declarations
import magneticDi from 'react-magnetic-di/eslint-plugin';

import {
  createConfig,
  defineRules,
  withPath,
  globals,
  PATHS,
} from '@simply-dev/eslint-utils';
import path from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
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

const magneticDiRules = defineRules({
  'magnetic-di/order': 'error',
  'magnetic-di/no-duplicate': 'error',
  'magnetic-di/no-extraneous': 'error',
  'magnetic-di/no-restricted-injectable': 'error',
  'magnetic-di/sort-dependencies': 'error',
});

export const extendFrontendConfig = (basePath?: string) => {
  const joinWithBasePath = (pathString: string) =>
    path.join(basePath ?? '', pathString);
  const sourceConfig = withPath(joinWithBasePath(PATHS.SOURCE.FILE));
  const pageConfig = withPath(joinWithBasePath(PATHS.ARCHITECTURE.PAGES));
  const pagesAndFeaturesConfig = withPath([
    joinWithBasePath(PATHS.ARCHITECTURE.PAGES),
    joinWithBasePath(PATHS.ARCHITECTURE.FEATURES),
  ]);

  const settings = sourceConfig.defineSettings(globals.browser);
  const plugins = sourceConfig.definePlugins({
    'magnetic-di': {
      ...magneticDi,
    },
  });
  const rules = sourceConfig
    .rules()
    .add(reactRules)
    .add(checkFileRules)
    .add(magneticDiRules)
    .toFlatConfig();

  const overrides = sourceConfig.defineOverrides(
    reactRecommended,
    //@ts-expect-error mismatching types
    ...compat.extends('plugin:react-hooks/recommended')
  );
  const pageRules = pageConfig
    .rules()
    .add(
      defineRules({
        'import/no-default-export': 0,
        'import/no-named-export': 2,
      })
    )
    .toFlatConfig();
  const pageAndFeatureRules = pagesAndFeaturesConfig
    .rules()
    .add(
      defineRules({
        'check-file/no-index': 'error',
      })
    )
    .toFlatConfig();

  const config = createConfig(
    plugins,
    settings,
    rules,
    ...overrides,
    pageRules,
    pageAndFeatureRules
  );

  return extendBaseConfig(...config);
};

export default extendFrontendConfig();
