/** @type {import('@types/eslint').ESLint.Options['baseConfig']} */
// eslint-disable-next-line no-undef
module.exports = {
  root: true,
  parserOptions: { tsconfigRootDir: __dirname, project: ["./tsconfig.json"] },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier", "promise"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:promise/recommended",
    "plugin:prettier/recommended",
  ],
  ignorePatterns: ["src/DScript/grammar.ts"],
  rules: {
    "prettier/prettier": ["error", { endOfLine: "crlf" }],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error"],
  },
};
