export const upcRules: ValidationRule[] = [
  { description: "Must be 12 digits long", test: (v) => /^\d{12}$/.test(v) },
  { description: "Must not contain spaces", test: (v) => !/\s/.test(v) },
  { description: "Must not contain letters", test: (v) => /^[0-9]+$/.test(v) },
];

export type ValidationRule = {
  description: string;
  test: (value: string) => boolean;
};

export type ValidationRuleSet = Record<string, ValidationRule[]>;

export const validationRules: ValidationRuleSet = {
  UPC: upcRules,
};
