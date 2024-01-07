import { extendBaseConfig } from '@simply-dev/eslint-config-base';
//@ts-expect-error no type declarations
import pluginSecurity from 'eslint-plugin-security';
import {
  createConfig,
  PATHS,
  withPath,
  globals,
} from '@simply-dev/eslint-utils';

import path from 'path';

export const extendBackendConfig = (basePath?: string) => {
  const joinWithBasePath = (pathString: string) =>
    path.join(basePath ?? '', pathString);

  const sourceConfig = withPath(joinWithBasePath(PATHS.SOURCE.FILE));

  const overrides = sourceConfig.defineOverrides(
    pluginSecurity.configs.recommended
  );

  const settings = sourceConfig.defineSettings(globals.node);

  const config = createConfig(...overrides, settings);

  return extendBaseConfig(...config);
};

export default extendBackendConfig();
