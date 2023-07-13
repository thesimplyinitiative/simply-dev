import type { ESLint } from 'eslint';
import { FlatESLintConfig } from 'eslint-define-config';
import { configs } from './configs';
import { rules } from './rules';

interface FlatESLintPlugin extends Omit<ESLint.Plugin, 'configs'> {
  configs: Record<string, FlatESLintConfig[]>;
}

const plugin: FlatESLintPlugin = {
  configs,
  rules,
};

export default plugin;
