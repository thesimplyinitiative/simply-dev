import type { Rule } from 'eslint';
import { rules as magneticDiRules } from './react-magnetic-di';

export const rules: Record<string, Rule.RuleModule> = {
  ...magneticDiRules,
};
