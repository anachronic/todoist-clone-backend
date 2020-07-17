// eslint-disable-next-line
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
  },
  env: {
    node: true,
  },
  overrides: [
    {
      files: ['*.{js,ts}'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
      },
    },
  ],
  ignorePatterns: ['build/**/*.js', 'node_modules/**/*'],
}
