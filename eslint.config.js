import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";


export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      "object-curly-spacing": ["error", "always"],
      indent: ["error", 2],
      quotes: ["error", "double"],
    }
  },
  {
    files: ["bin/stack.cjs"],
    rules: {
      "no-undef": "off",
      "@typescript-eslint/no-require-imports": "off",
    }
  }
];
