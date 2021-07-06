// this matches the standard config, but uses prettier to do extra
// auto-formatting of wrapping and closing jsx blocks better than
// just eslint does
const prettierConfig = {
  arrowParens: 'always',
  bracketSpacing: true,
  embeddedLanguageFormatting: 'auto',
  endOfLine: 'lf',
  htmlWhitespaceSensitivity: 'css',
  insertPragma: false,
  jsxBracketSameLine: true,
  jsxSingleQuote: false,
  printWidth: 120,
  proseWrap: 'preserve',
  quoteProps: 'as-needed',
  requirePragma: false,
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'none',
  useTabs: false,
  vueIndentScriptAndStyle: false
}

module.exports = {
  plugins: ['prettier'],
  extends: ['prettier'],
  rules: {
    'prettier/prettier': ['error', prettierConfig],
    'react/prop-types': 'off'
  }
}
