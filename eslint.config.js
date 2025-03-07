// eslint.config.js
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat();

export default [
  js.configs.recommended,
  ...compat.config({
    extends: ['next/core-web-vitals'],
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
    },
  }),
  {
    ignores: ['node_modules/**', '.next/**', 'public/**'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        React: 'readonly',
        JSX: 'readonly',
      },
    },
    rules: {
      // Disable eslint rules that conflict with Next.js conventions
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'import/no-anonymous-default-export': 'off',
      // Add more custom rules here
    },
  },
];
