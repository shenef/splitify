import js from "@eslint/js"
import globals from "globals"

export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaVersion: 2022,
      },
    },
    rules: {
      indent: ["error", 2],
      quotes: ["error", "double"],
      semi: ["error", "never"],
      "no-useless-concat": "error",
    },
  },
]
