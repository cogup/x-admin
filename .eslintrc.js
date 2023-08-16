module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'prettier'
  ],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.eslint.json'
  },
  plugins: ['react', 'prettier'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'off',
    'no-console': 1,
    'prettier/prettier': 2
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
};
