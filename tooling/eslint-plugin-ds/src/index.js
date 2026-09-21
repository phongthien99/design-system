import noHardcodedToken from "./rules/no-hardcoded-token.js";
import noHardcodedTokenCss from "./rules/no-hardcoded-token-css.js";

export default {
  meta: { name: "@company/eslint-plugin-ds", version: "0.1.0" },
  rules: {
    "no-hardcoded-token": noHardcodedToken,
    "no-hardcoded-token-css": noHardcodedTokenCss
  }
};
