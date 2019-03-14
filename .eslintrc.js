module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/recommended', 'eslint:recommended'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    quotes: [2, 'single', 'avoid-escape'],
    'vue/html-closing-bracket-newline': 0,
    'vue/max-attributes-per-line': [
      1,
      {
        max: 1,
        allowFirstLine: true
      }
    ]
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
};
