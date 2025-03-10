// eslint.config.js
const { defineConfig } = require('eslint/config');
const stylistic = import('@stylistic/eslint-plugin');
const electronEslintConfig = require('@electron-toolkit/eslint-config');

module.exports = defineConfig([
  electronEslintConfig,
  {
    plugins: {
      '@stylistic': stylistic
    },
    rules: {
      '@/indent': ['error', 2],
      '@/semi': 'error',
      '@/quotes': ['error', 'single']
    }
  },
]);