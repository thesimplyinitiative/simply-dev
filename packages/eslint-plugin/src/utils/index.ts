import { FlatESLintConfig, FlatESLintConfigItem } from 'eslint-define-config';

export { PATHS as PATH } from './paths';

export function createConfig(
  ...configs: FlatESLintConfig[]
): FlatESLintConfig[] {
  return [...configs];
}

export function defineOverrides(
  ...overrides: (
    | Omit<FlatESLintConfigItem, 'files'>
    | 'eslint:recommended'
    | 'eslint:all'
  )[]
): (FlatESLintConfigItem | 'eslint:recommended' | 'eslint:all')[] {
  return [...overrides];
}

export function definePlugins(plugins: FlatESLintConfigItem['plugins']): {
  plugins: FlatESLintConfigItem['plugins'];
} {
  return {
    plugins,
  };
}

type Settings = Pick<
  FlatESLintConfigItem,
  'languageOptions' | 'linterOptions'
> & {
  settings?: Record<string, unknown>;
};

export function defineSettings<S extends Settings>(settings: S): S {
  return settings;
}

export function defineRules<R extends FlatESLintConfigItem['rules']>(
  rule: R
): Readonly<R> {
  return rule;
}

export function rules() {
  const rulesArr: FlatESLintConfigItem['rules'][] = [];
  return {
    add(rules: FlatESLintConfigItem['rules']) {
      rulesArr.push(rules);
      return this;
    },
    toConfig(): { rules: FlatESLintConfigItem['rules'] }[] {
      return rulesArr.map((rules) => ({ rules }));
    },

    toFlatConfig(): { rules: FlatESLintConfigItem['rules'] } {
      return {
        rules: Object.assign({}, ...rulesArr),
      };
    },
  } as const;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FunctionReturnWithPath<F extends (...args: any[]) => any> = (
  ...args: Parameters<F>
) => // eslint-disable-next-line @typescript-eslint/no-explicit-any
ReturnType<F> extends any[]
  ? ({ files: string[] } & ReturnType<F>[number])[]
  : { files: string[] } & ReturnType<F>;

type WithPath<_Path extends string> = {
  defineOverrides: (
    ...overrides: Omit<FlatESLintConfigItem, 'files'>[]
  ) => (FlatESLintConfigItem & { files: string[] })[];
  definePlugins: FunctionReturnWithPath<typeof definePlugins>;
  defineSettings: FunctionReturnWithPath<typeof defineSettings>;
  rules: () => {
    add: (
      ...args: Parameters<ReturnType<typeof rules>['add']>
    ) => ReturnType<WithPath<_Path>['rules']>;
    toConfig: FunctionReturnWithPath<ReturnType<typeof rules>['toConfig']>;
    toFlatConfig: FunctionReturnWithPath<
      ReturnType<typeof rules>['toFlatConfig']
    >;
  };
  defineRules: FunctionReturnWithPath<typeof defineRules>;
};

export function withPath<Path extends string>(
  pathOrPaths: readonly Path[] | Path
): WithPath<Path> {
  const files = (
    Array.isArray(pathOrPaths) ? pathOrPaths : [pathOrPaths]
  ) as string[];

  return {
    defineOverrides: (...overrides) => {
      const definedOverrides = defineOverrides(
        ...overrides
      ) as FlatESLintConfigItem[];

      return definedOverrides.map((override) => ({
        files,
        ...override,
      }));
    },
    definePlugins: (plugins) => {
      const definedPlugins = definePlugins(plugins);
      return { files, ...definedPlugins };
    },
    defineSettings: (settings) => {
      const definedSettings = defineSettings(settings);
      return { files, ...definedSettings };
    },
    defineRules: (rules) => {
      const definedRules = defineRules(rules);
      return { files, ...definedRules } as ReturnType<
        FunctionReturnWithPath<typeof defineRules>
      >;
    },
    rules: () => {
      const definedRules = rules();
      return {
        add(rules) {
          definedRules.add(rules);
          return this;
        },
        toConfig: () => {
          return definedRules.toConfig().map((rules) => ({ files, ...rules }));
        },
        toFlatConfig: () => {
          return { files, ...definedRules.toFlatConfig() };
        },
      };
    },
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/ban-types
type Ignore<_Path extends string> = {};

export function ignore<Path extends string>(
  pathOrPaths: readonly Path[] | Path
): Ignore<Path> {
  const ignores = (
    Array.isArray(pathOrPaths) ? pathOrPaths : [pathOrPaths]
  ) as string[];

  return {
    ignores,
  } as FlatESLintConfigItem;
}
