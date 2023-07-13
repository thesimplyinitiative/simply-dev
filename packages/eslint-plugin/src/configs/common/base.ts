import * as typescriptEslint from '@typescript-eslint/eslint-plugin';
import * as typescriptParser from '@typescript-eslint/parser';

import * as importPlugin from 'eslint-plugin-import';

import * as checkFile from 'eslint-plugin-check-file';

import * as jest from 'eslint-plugin-jest';
import * as sonarLint from 'eslint-plugin-sonarjs';

import * as spellcheck from 'eslint-plugin-spellcheck';

import globals from './globals';
import { PATHS } from '../../utils/paths';
import {
  definePlugins,
  defineRules,
  rules,
  defineSettings,
  createConfig,
  defineOverrides,
  withPath,
} from '../../utils';

const overrides = defineOverrides(
  'eslint:recommended',
  typescriptEslint.configs['recommended'],
  importPlugin.configs['recommended'],
  importPlugin.configs['typescript'],
  sonarLint.configs.recommended
);

const plugins = definePlugins({
  '@typescript-eslint': typescriptEslint,
  import: importPlugin,
  'check-file': checkFile,
  sonarjs: sonarLint,
  spellcheck,
});

const settings = defineSettings({
  linterOptions: {
    reportUnusedDisableDirectives: true,
  },
  settings: {
    'import/resolver': {
      typescript: true,
      node: true,
    },
  },
  languageOptions: {
    //@ts-expect-error no type decelerations
    parser: typescriptParser,
  },
});

const spellCheckRules = defineRules({
  'spellcheck/spell-checker': [
    1,
    {
      ignoreRequire: true,
      enableUpperCaseUnderscoreCheck: true,
      lang: 'en_AU',
      skipWords: [
        'aliceblue',
        'bgcolor',
        'dinero',
        'Formik',
        'keypath',
        'notistack',
        'plugins',
        'Popover',
        'rego',
        'rrule',
        'signup',
        'sonarjs',
        'strapi',
        'testid',
        'textfield',
        'thesimplyinitiative',
        'typecheck',
        'unfocus',
        'whitesmoke',
      ],
    },
  ],
});

const importRules = defineRules({
  'import/order': [
    'error',
    {
      groups: [
        'builtin',
        'external',
        'internal',
        'parent',
        'sibling',
        'index',
        'object',
        'type',
      ],
      pathGroups: [{ pattern: 'react', group: 'builtin', position: 'before' }],
      'newlines-between': 'always',
    },
  ],
  'import/no-default-export': 2,
  'import/no-internal-modules': [
    'error',
    {
      forbid: [PATHS.SOURCE.ANY],
    },
  ],
  'import/no-named-as-default-member': 0,
  'import/no-cycle': 2,
  'import/no-self-import': 2,
  'import/no-useless-path-segments': 2,
  'import/no-relative-packages': 2,
  'import/no-extraneous-dependencies': 2,
});

const typescriptRules = defineRules({
  '@typescript-eslint/no-non-null-assertion': 0,
  '@typescript-eslint/no-unused-vars': ['warn', { ignoreRestSiblings: true }],
  '@typescript-eslint/consistent-type-imports': 'error',
  '@typescript-eslint/consistent-type-exports': 'error',
  '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
  '@typescript-eslint/consistent-generic-constructors': 'error',
  '@typescript-eslint/consistent-type-assertions': [
    'error',
    { assertionStyle: 'as', objectLiteralTypeAssertions: 'never' },
  ],
  '@typescript-eslint/naming-convention': 'warn',
});

const checkFileRules = defineRules({
  'check-file/filename-naming-convention': [
    'error',
    { [PATHS.SOURCE.FILE]: 'KEBAB_CASE' },
    { ignoreMiddleExtensions: true },
  ],
  'check-file/folder-naming-convention': [
    'error',
    { [PATHS.SOURCE.FOLDER]: 'KEBAB_CASE' },
  ],
});

const pluginRules = rules()
  .add(spellCheckRules)
  .add(importRules)
  .add(typescriptRules)
  .add(checkFileRules)
  .toFlatConfig();

const jestConfig = withPath(PATHS.UNIT_TEST.ANY_FILE);

const jestOverrides = jestConfig.defineOverrides(
  {
    ...jest.configs['recommended']['rules'],
  },
  {
    ...jest.configs['style']['rules'],
  },
  {
    ...globals.jest,
    ...definePlugins({ jest }),
    ...rules()
      .add(
        defineRules({
          'check-file/folder-match-with-fex': [
            'error',
            {
              [PATHS.UNIT_TEST.FILE]: PATHS.UNIT_TEST.FOLDER,
            },
          ],
          'check-file/folder-naming-convention': 'off',
        })
      )
      .add(defineRules({ 'jest/prefer-lowercase-title': 'error' }))
      .toFlatConfig(),
  }
);

export const base = createConfig(
  ...overrides,
  plugins,
  settings,
  pluginRules,
  ...jestOverrides
);
