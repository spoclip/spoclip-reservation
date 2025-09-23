import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import importPlugin from 'eslint-plugin-import';
import eslintConfigPrettier from 'eslint-config-prettier';
import pluginQuery from '@tanstack/eslint-plugin-query';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
      pluginQuery.configs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },

  eslintConfigPrettier,

  {
    rules: {
      'no-console': 'warn',
    },
  },

  {
    extends: [
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
    ],
    rules: {
      'import/no-duplicates': 'error',
      'import/no-unresolved': 'off',
      'import/no-relative-parent-imports': 'error',
      'import/no-cycle': 'error',
      'import/newline-after-import': 'error',
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
          pathGroups: [
            {
              pattern: 'react',
              group: 'builtin',
              position: 'after',
            },
            {
              pattern: '@repo/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@pages/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@routes/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@components/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@hooks/**',
              group: 'internal',
              position: 'before',
            },

            {
              pattern: '@libs/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@constants/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@utils/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@styles/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@types/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@assets/**',
              group: 'internal',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
        },
      ],
    },
  },
]);
