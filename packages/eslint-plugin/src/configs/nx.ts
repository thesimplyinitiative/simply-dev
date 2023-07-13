import * as nxEslint from '@nrwl/eslint-plugin-nx';
import {
  createConfig,
  definePlugins,
  defineRules,
  ignore,
  PATH,
  withPath,
} from '../utils';

const rootPlugins = definePlugins({
  '@nrwl/nx': nxEslint,
});

const ignoreAll = ignore(PATH.SOURCE.ANY);

const allFilesRules = withPath(PATH.SOURCE.FILE)
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

const tsFileOverrides = withPath(PATH.SOURCE.TS_FILES).defineOverrides(
  //@ts-expect-error type declaration is wrong
  ...nxEslint.configs.typescript
);

const jsFileOverrides = withPath(PATH.SOURCE.JS_FILES).defineOverrides(
  //@ts-expect-error type declaration is wrong
  ...nxEslint.configs.javascript
);

const rootConfig = createConfig(
  rootPlugins,
  ignoreAll,
  allFilesRules,
  ...tsFileOverrides,
  ...jsFileOverrides
);

const unIgnoreAll = ignore('!**/*');

const projectConfig = createConfig(...rootConfig, unIgnoreAll);

export const nx = {
  rootConfig,
  projectConfig,
};
