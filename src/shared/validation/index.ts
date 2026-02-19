import { ValidationRuleSet } from "./types";
import { upcRules } from "./rules/upcRules";

export const validationRules: ValidationRuleSet = {
  "UPC": upcRules
};
