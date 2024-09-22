import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

export default [
  { files: ["**/*.{js,mjs,cjs,jsx}"] },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
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
    }
  }
];