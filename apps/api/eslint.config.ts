import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/*.d.ts'
    ]
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': 'error',
      'quotes': ['error', 'single', { avoidEscape: true }],
      'max-len': ['error', { code: 100 }],
      'semi': ['error', 'always'],
    }
  },
]);
