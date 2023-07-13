import { base } from './common/base';
import globals from './common/globals';

import * as security from 'eslint-plugin-security';
import {
  createConfig,
  defineOverrides,
  definePlugins,
  defineSettings,
} from '../utils';

const plugins = definePlugins({ security });

const settings = defineSettings(globals.node);

const overrides = defineOverrides(...security.configs['recommended']);

export const backend = createConfig(...base, ...overrides, plugins, settings);
