module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: ['eslint:recommended', 'eslint-config-prettier', 'airbnb'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {},
};
