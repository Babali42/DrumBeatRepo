// eslint.config.js
import js from '@eslint/js';
import * as tseslint from 'typescript-eslint';
import angular from '@angular-eslint/eslint-plugin';
import angularTemplate from '@angular-eslint/eslint-plugin-template';
import angularParser from '@angular-eslint/template-parser';
import functionalPlugin from 'eslint-plugin-functional';

export default [
  // Base configs for all files
  js.configs.recommended,

  // Configuration files (JS/MJS) - no type checking
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs', 'eslint.config.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },

  // TypeScript files with type checking
  ...tseslint.configs.recommendedTypeChecked.map(config => ({
    ...config,
    files: ['**/*.ts'],
  })),

  // TypeScript files - custom rules
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.json'],
        createDefaultProgram: true,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      '@angular-eslint': angular,
      functional: functionalPlugin,
    },
    rules: {
      // Angular specific rules
      '@angular-eslint/component-class-suffix': 'error',
      '@angular-eslint/directive-class-suffix': 'error',
      '@angular-eslint/no-input-rename': 'error',
      '@angular-eslint/no-output-rename': 'error',
      '@angular-eslint/use-pipe-transform-interface': 'error',
      '@angular-eslint/prefer-on-push-component-change-detection': 'warn',

      // TypeScript functional rules
      '@typescript-eslint/prefer-readonly': 'warn',
      '@typescript-eslint/prefer-readonly-parameter-types': 'off', // Too strict for Angular

      // Functional programming rules (Angular-optimized)
      'functional/no-let': ['warn', {
        'allowInForLoopInit': true,
        'allowInFunctions': false,
      }],
      'functional/prefer-readonly-type': ['warn', {
        'allowLocalMutation': true,
        'allowMutableReturnType': true,
        'ignoreClass': 'fieldsOnly', // Allow Angular component properties
      }],
      'functional/immutable-data': ['warn', {
        'ignoreClasses': true,
        'ignoreImmediateMutation': true,
        'ignoreAccessorPattern': ['**.current', '**.value'], // For Angular forms
      }],
      'functional/no-mixed-types': 'warn',
      'functional/prefer-tacit': 'off',
      'functional/no-conditional-statements': 'off', // Too strict for Angular
      'functional/no-expression-statements': 'off', // Angular needs side effects
      'functional/functional-parameters': ['warn', {
        'allowRestParameter': true,
        'allowArgumentsKeyword': false,
      }],
      'functional/no-return-void': ['warn', {
        'allowNull': true,
        'allowUndefined': true,
      }],
      'functional/prefer-property-signatures': 'warn',
      'functional/type-declaration-immutability': 'warn',
    },
  },

  // Configuration files (JS/MJS) - no type checking
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs', 'eslint.config.js'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      // Only basic ESLint rules for config files
    },
  },

  // Angular Components - relaxed functional rules
  {
    files: ['**/*.component.ts'],
    rules: {
      'functional/no-return-void': 'off', // Angular components need void methods
      'functional/no-expression-statements': 'off', // Components have side effects
      'functional/immutable-data': ['warn', {
        'ignoreClasses': true,
        'ignoreImmediateMutation': true,
        'ignoreAccessorPattern': ['**.current', '**.value', '**.nativeElement'],
      }],
    },
  },

  // Angular HTML templates
  {
    files: ['**/*.html'],
    plugins: {
      '@angular-eslint/template': angularTemplate,
    },
    languageOptions: {
      parser: angularParser,
    },
    rules: {
      '@angular-eslint/template/no-negated-async': 'error',
      // Add more Angular template rules if needed
    },
  },

  // Test files - more relaxed rules
  {
    files: ['**/*.spec.ts', '**/*.test.ts'],
    rules: {
      'functional/immutable-data': 'off',
      'functional/no-mixed-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/unbound-method': 'off',
    },
  },

  // ✅ Allow Node.js globals in config files
  {
    files: ['jest.config.js', 'karma.conf.js'],
    languageOptions: {
      globals: {
        module: 'writable',
        require: 'readonly',
        __dirname: 'readonly',
      }
    },
  },
];
