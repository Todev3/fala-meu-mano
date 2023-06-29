module.exports = {
  env: {
    es2020: true,
    node: true,
  },
  extends: [
    "standard-with-typescript",
    "plugin:prettier/recommended",
    "plugin:promise/recommended",
  ],
  overrides: [],
  plugins: ["unused-imports", "promise"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.dev.json",
    tsconfigRootDir: __dirname,
  },
  rules: {
    "@typescript-eslint/no-unused-vars": "error",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/strict-boolean-expressions": 0,
  },
};
