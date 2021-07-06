module.exports = {
  extends: ['standard-with-typescript', 'standard-jsx', 'standard-react'],
  parserOptions: {
    project: './tsconfig.json'
  },
  ignorePatterns: ['dist/**'],
  rules: {
    '@typescript-eslint/no-unnecessary-type-assertion': 'off',
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/promise-function-async': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/consistent-type-assertions': 'off',
    '@typescript-eslint/triple-slash-reference': 'off',
    '@typescript-eslint/prefer-ts-expect-error': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    'react/jsx-handler-names': 'off',
    'react/jsx-closing-tag-location': 'warn',
    'react/no-unused-prop-types': 'warn',
    '@typescript-eslint/restrict-plus-operands': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off'
  }
}
