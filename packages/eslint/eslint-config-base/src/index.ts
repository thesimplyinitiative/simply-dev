import { FlatCompat } from '@eslint/eslintrc';

import js from '@eslint/js';
//@ts-expect-error no type declarations
import prettierEslint from 'eslint-config-prettier';
//@ts-expect-error no module for some reason
import typescriptParser from '@typescript-eslint/parser';

import path from 'path';
import { fileURLToPath } from 'url';
import {
  defineRules,
  rules,
  defineSettings,
  createConfig,
  defineOverrides,
  withPath,
  PATHS,
  globals,
} from '@simply-dev/eslint-utils';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const overrides = defineOverrides(
  js.configs.recommended,
  //@ts-expect-error mismatching types
  ...compat.extends(
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:sonarjs/recommended'
  )
);

const plugins = compat.plugins('spellcheck', 'check-file');

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
  'check-file/filename-blocklist': [
    'error',
    { [PATHS.UNIT_TEST.BLACKLISTED]: `*.${PATHS.UNIT_TEST.BLACKLISTED}` },
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
  //@ts-expect-error mismatching types
  ...compat.extends('plugin:jest/recommended', 'plugin:jest/style'),
  {
    ...globals.jest,
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

const base = createConfig(
  ...overrides,
  //@ts-expect-error mismatching types
  ...plugins,
  settings,
  pluginRules,
  ...jestOverrides,
  prettierEslint
);

export default base;

export const extendBaseConfig = (
  ...configs: Parameters<typeof createConfig>
): ReturnType<typeof createConfig> => [...base, ...configs, prettierEslint];
