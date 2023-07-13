import { frontend } from './frontend';
import { backend } from './backend';
import { nx } from './nx';
import { FlatESLintConfig } from 'eslint-define-config';

export const configs: Record<string, FlatESLintConfig[]> = {
  frontend,
  backend,
  nxRoot: nx.rootConfig,
  nxProject: nx.projectConfig,
};
