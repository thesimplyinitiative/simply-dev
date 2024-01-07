import { FlatCompat } from '@eslint/eslintrc';
import {
  type FlatESLintConfig,
  PATHS,
  createConfig,
  defineRules,
  ignore,
  withPath,
} from '@simply-dev/eslint-utils';

import path from 'path';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const ignoreAll = ignore(PATHS.SOURCE.ANY);

const nxPlugin = compat.plugins('@nrwl/nx');

const nxTypescriptExtension = compat.extends('plugin:@nrwl/nx/typescript');

const nxJavascriptExtension = compat.extends('plugin:@nrwl/nx/javascript');

const anyFileConfig = withPath(['*.ts', '*.tsx', '*.js', '*.jsx'])
  .rules()
  .add(
    defineRules({
      '@nrwl/nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    })
  )
  .toFlatConfig();

const tsConfig = withPath(['*.ts', '*.tsx']).defineOverrides(
  //@ts-expect-error mismatching types
  nxTypescriptExtension
);

const jsConfig = withPath(['*.js', '*.jsx']).defineOverrides(
  //@ts-expect-error mismatching types
  nxJavascriptExtension
);

export const rootConfig = createConfig(
  ignoreAll,
  //@ts-expect-error mismatching types
  nxPlugin,
  anyFileConfig,
  ...tsConfig,
  ...jsConfig
);

export const createNxProjectConfig = (
  fileUrl: string,
  ...additionalConfig: FlatESLintConfig[]
) => {
  const __filename = fileURLToPath(fileUrl);
  const __dirname = path.dirname(__filename);

  const ignoreConfig = withPath(__dirname).defineOverrides({
    ignores: [`!${PATHS.SOURCE.ANY}`],
  });

  return createConfig(...ignoreConfig, ...additionalConfig);
};
