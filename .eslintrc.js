module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        "google",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        "ecmaVersion": 12,
        "sourceType": "module",
    },
    plugins: [
        "@typescript-eslint",
    ],
    rules: {
        "semi": ["error", "always"],
        "quotes": ["error", "double"],
        "require-jsdoc": 0,
        "max-len": 0,
        "no-unused-vars": 1,
        "no-multiple-empty-lines": ["error", {"max": 2, "maxEOF": 1}],
        "indent": ["error", 4],
    },
};
