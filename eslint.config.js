// ESLint flat config (ESLint 9+).
// The project currently delivers its JavaScript inline in index.html.
// This config covers any future extracted *.js files at the root or under js/,
// excluding config files and the GoatCounter analytics script.
// Splitting inline code into separate files is tracked in docs/decisions/ as ADR 001.

import globals from 'globals';

export default [
  {
    ignores: [
      'eslint.config.js',
      'node_modules/**',
      'assets/analytics/count.js',
    ],
  },
  {
    files: ['*.js', 'js/**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'script',
      globals: globals.browser,
    },
    rules: {
      'no-unused-vars': ['error', { caughtErrorsIgnorePattern: '^_' }],
      'no-undef': 'error',
      'eqeqeq': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
    },
  },
];
