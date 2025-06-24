/** @type {import('prettier').Config} */
module.exports = {
    semi: true,
    singleQuote: true,
    trailingComma: 'all',
    printWidth: 80,
    tabWidth: 4,
    jsxSingleQuote: false,
    bracketSpacing: true,
    arrowParens: 'avoid',
    endOfLine: 'auto',
    plugins: ['prettier-plugin-tailwindcss'],
};
