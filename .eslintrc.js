// Use Typescript compilation to provide errors based on typing
// See: https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/TYPED_LINTING.md

module.exports = {
  env: {
    es2020: true,
    jasmine: true,
    node: true,
  },
  root: true,
  plugins: [ '@typescript-eslint' ],
  overrides: [
    {
      files: [ './src/**/*.ts' ],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2020,
        project: './tsconfig.json',
        sourceType: 'module',
      },
      rules: {
        // From Typescript ESLint plugin

        '@typescript-eslint/array-type': [
          'error',
          {
            default: 'generic',
          },
        ],
        '@typescript-eslint/ban-types': 'warn',
        '@typescript-eslint/consistent-type-assertions': 'off',
        '@typescript-eslint/consistent-type-definitions': [ 'error', 'interface' ],
        '@typescript-eslint/dot-notation': 'off',
        '@typescript-eslint/explicit-member-accessibility': 'off',
        '@typescript-eslint/member-delimiter-style': [
          'error',
          {
            multiline: {
              delimiter: 'semi',
              requireLast: true,
            },
            singleline: {
              delimiter: 'semi',
              requireLast: false,
            },
          },
        ],
        '@typescript-eslint/member-ordering': [ 'error', {
          default: [
            // Fields
            'private-field',
            'public-field',

            // Constructors
            'constructor',

            // Methods
            'public-method',
            'private-method',
            'protected-method',
          ],
        } ],
        '@typescript-eslint/naming-convention': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-empty-interface': 'error',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/no-inferrable-types': [
          'error',
          {
            ignoreParameters: true,
          },
        ],
        '@typescript-eslint/no-unused-expressions': 'error',
        '@typescript-eslint/no-unsafe-assignment': 'warn',
        '@typescript-eslint/no-unsafe-argument': 'warn',
        '@typescript-eslint/no-unsafe-return': 'warn',
        '@typescript-eslint/no-shadow': 'error',
        '@typescript-eslint/no-unsafe-call': 'warn',
        '@typescript-eslint/no-unsafe-member-access': 'warn',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/restrict-plus-operands': 'off',
        '@typescript-eslint/restrict-template-expressions': 'off',
        '@typescript-eslint/quotes': [
          'error',
          'single',
        ],
        '@typescript-eslint/semi': 'error',
        '@typescript-eslint/type-annotation-spacing': 'error',
        '@typescript-eslint/unbound-method': 'off',

        // From ESLint plugin

        'array-bracket-spacing': [ 'error', 'always' ],
        'arrow-parens': [
          'error',
          'as-needed',
        ],
        'arrow-spacing': [
          'error',
          {
            after: true,
            before: true,
          },
        ],
        'brace-style': [
          'error',
          '1tbs',
        ],
        'comma-dangle': [
          'error',
          'always-multiline',
        ],
        'comma-spacing': [
          'error',
          {
            after: true,
            before: false,
          },
        ],
        'computed-property-spacing': 'error',
        curly: 'error',
        eqeqeq: [
          'error',
          'smart',
        ],
        'guard-for-in': 'error',
        indent: [
          'error',
          2,
          {
            SwitchCase: 1,
            MemberExpression: 1,
          },
        ],
        'key-spacing': 'error',
        'keyword-spacing': 'error',
        'multiline-ternary': [ 'error', 'always' ],
        'no-eval': 'error',
        'no-multiple-empty-lines': 'error',
        'no-multi-spaces': 'error',
        'no-new-wrappers': 'error',
        'no-restricted-imports': [
          'error',
          'rxjs/Rx',
          'rxjs/internal/operators',
        ],
        'no-sparse-arrays': 'off',
        'no-trailing-spaces': 'error',
        'no-undef-init': 'error',
        'no-underscore-dangle': 'error',
        'no-unused-expressions': 'error',
        'no-var': 'error',
        'object-curly-spacing': [ 'error', 'always' ],
        'padding-line-between-statements': [
          'error',
          { blankLine: 'always', prev: '*', next: 'return' },
          { blankLine: 'always', prev: [ 'const', 'let' ], next: '*' },
          { blankLine: 'any', prev: [ 'const', 'let' ], next: [ 'const', 'let' ] },
          { blankLine: 'always', prev: '*', next: 'block-like' },
          { blankLine: 'always', prev: 'block-like', next: '*' },
          { blankLine: 'always', prev: '*', next: 'multiline-expression' },
          { blankLine: 'always', prev: 'multiline-expression', next: '*' },
        ],
        'prefer-const': 'error',
        'quote-props': [
          'error',
          'as-needed',
        ],
        'rest-spread-spacing': 'error',
        'semi-spacing': 'error',
        'space-before-function-paren': [
          'error',
          {
            anonymous: 'never',
            asyncArrow: 'always',
            named: 'never',
          },
        ],
        'space-infix-ops': 'error',
        'spaced-comment': 'error',
        'switch-colon-spacing': 'error',
        'template-curly-spacing': 'error',
      },
    },
  ],
};
