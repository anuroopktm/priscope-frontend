import { ValidationRule } from "../types";

export const upcRules: ValidationRule[] = [
  { description: "Must be 12 digits long", test: (v) => /^\d{12}$/.test(v) },
  { description: "Must not contain spaces", test: (v) => !/\s/.test(v) },
  { description: "Must not contain letters", test: (v) => /^[0-9]+$/.test(v) },
];
