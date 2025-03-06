// eslint.config.js
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat();

export default [
  js.configs.recommended,
  ...compat.config({
    extends: ['next/core-web-vitals'],
  }),
  {
    ignores: ['node_modules/**', '.next/**', 'public/**'],
    rules: {
      // Add your custom rules here
    },
  },
];
