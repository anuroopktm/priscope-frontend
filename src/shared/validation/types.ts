export type ValidationRule = {
  description: string;
  test: (value: string) => boolean;
};

export type ValidationRuleSet = Record<string, ValidationRule[]>;
